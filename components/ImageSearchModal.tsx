
import React, { useState, useCallback, useRef } from 'react';
import type { Product } from '../types';
import { Type } from "@google/genai";


const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UploadIcon = () => (
    <svg className="mx-auto h-12 w-12 text-maroon-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductClick: (product: Product) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const ImageSearchModal: React.FC<ImageSearchModalProps> = ({ isOpen, onClose, products, onProductClick }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<Product[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = useCallback(() => {
        setImagePreview(null);
        setImageFile(null);
        setIsLoading(false);
        setError(null);
        setResults([]);
    }, []);

    const handleClose = () => {
        onClose();
        // Delay reset to allow for closing animation
        setTimeout(resetState, 300);
    };

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            resetState();
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSearch = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
            const base64Data = await fileToBase64(imageFile);
            
            const imagePart = {
                inlineData: {
                    mimeType: imageFile.type,
                    data: base64Data,
                },
            };

            const productListString = JSON.stringify(products.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                category: p.category,
                subcategory: p.subcategory
            })));

            const textPart = {
                text: `Analyze the product in this image. Compare it to the following list of products and identify the top 3 most similar items based on appearance, product type, and potential use. Respond ONLY with a JSON object containing a single key 'productIds' which is an array of the matching product IDs (as numbers). If no relevant products are found, return an empty array. Product List: ${productListString}`
            };

            // Updated endpoint for Netlify functions
            const response = await fetch('/.netlify/functions/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemini-3-flash-preview',
                    contents: { parts: [imagePart, textPart] },
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.OBJECT,
                            properties: {
                                productIds: {
                                    type: Type.ARRAY,
                                    items: { type: Type.INTEGER }
                                }
                            }
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const apiResponse = await response.json();
            const responseText = apiResponse.candidates[0].content.parts[0].text.trim();
            const result = JSON.parse(responseText);

            if (result.productIds && result.productIds.length > 0) {
                const foundProducts = result.productIds
                    .map((id: number) => products.find(p => p.id === id))
                    .filter((p: Product | undefined): p is Product => p !== undefined);
                setResults(foundProducts);
            } else {
                setError("No similar products found in our collection.");
            }

        } catch (err) {
            console.error("Image search error:", err);
            setError("Sorry, we couldn't process your image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={handleClose}></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white p-4 sm:p-6">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-serif font-bold leading-6 text-maroon-900" id="modal-title">
                                    Search by Image
                                </h3>
                                <button type="button" className="m-2 p-2 text-maroon-500 hover:text-maroon-800" onClick={handleClose}>
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="mt-4">
                                {!imagePreview ? (
                                    <div>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-maroon-200 px-6 py-10 cursor-pointer hover:border-maroon-400"
                                        >
                                            <div className="text-center">
                                                <UploadIcon />
                                                <div className="mt-4 flex text-sm leading-6 text-maroon-600">
                                                    <p className="pl-1">Click to upload or drag and drop</p>
                                                </div>
                                                <p className="text-xs leading-5 text-maroon-500">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </div>
                                        <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={e => handleFileChange(e.target.files ? e.target.files[0] : null)} />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="w-full aspect-square overflow-hidden rounded-lg bg-maroon-100 flex items-center justify-center">
                                            <img src={imagePreview} alt="Preview" className="max-h-full max-w-full" />
                                        </div>
                                        <div className="flex gap-4">
                                            <button onClick={() => fileInputRef.current?.click()} className="flex-1 rounded-md border border-maroon-300 bg-white py-2 px-4 text-sm font-semibold text-maroon-800 shadow-sm hover:bg-maroon-100">
                                                Change Image
                                            </button>
                                            <button onClick={handleSearch} disabled={isLoading} className="flex-1 rounded-md border border-transparent bg-maroon-800 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-maroon-900 disabled:bg-maroon-400">
                                                {isLoading ? 'Searching...' : 'Find Similar Products'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6">
                                    {isLoading && (
                                        <div className="text-center py-4">
                                            <p className="text-maroon-700">Analyzing your image...</p>
                                        </div>
                                    )}
                                    {error && (
                                        <div className="text-center py-4 text-red-600 bg-red-50 p-3 rounded-md">
                                            <p>{error}</p>
                                        </div>
                                    )}
                                    {results.length > 0 && (
                                        <div>
                                            <h4 className="text-base font-semibold text-maroon-800 mb-3">Our Recommendations:</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {results.map(product => (
                                                    <div key={product.id} onClick={() => onProductClick(product)} className="group cursor-pointer">
                                                        <div className="aspect-square w-full overflow-hidden rounded-lg bg-maroon-100">
                                                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105" />
                                                        </div>
                                                        <h5 className="mt-2 text-sm font-medium text-maroon-900 truncate">{product.name}</h5>
                                                        <p className="text-sm text-maroon-600">{product.price.toFixed(2)}৳</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageSearchModal;
