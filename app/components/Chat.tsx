import { Box, VStack, Text, Center, Spinner, Image } from "@chakra-ui/react";
import { useState, DragEvent } from "react";
import axios from "axios";

interface ChatProps {
    onHtmlGenerated: (html: string) => void;
}

export default function Chat({ onHtmlGenerated }: ChatProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setIsLoading(true);
            const base64Image = await convertToBase64(file);
            setImageUrl(base64Image);
            const data = await getHtmlFromImage(base64Image);
            onHtmlGenerated(data);
            setIsLoading(false);
        }
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const getHtmlFromImage = async (base64Image: string): Promise<string> => {
        try {
            const response = await axios.post('/api/generate-html', { base64Image });
            return response.data.text.trim('```html\n');
        } catch (error) {
            console.error('Error calling API route:', error);
            return '<p>Error generating HTML from image</p>';
        }
    };

    return (
        <Box
            height="100%"
            border="2px dashed"
            borderColor={isDragging ? "blue.500" : "gray.300"}
            borderRadius="md"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            transition="all 0.3s"
            bg={isDragging ? "blue.50" : "transparent"}
        >
            <Center height="100%">
                {isLoading ? (
                    <Spinner size="6xl" color="blue.500" />
                ) : imageUrl ? (
                    <Image src={imageUrl} alt="Dropped image" maxHeight="100%" maxWidth="100%" objectFit="contain" />
                ) : (
                    <VStack spacing={4}>
                        <Text fontSize="xl" fontWeight="bold">
                            画像をドロップしてください
                        </Text>
                        <Text color="gray.500">
                            ここに画像をドラッグ＆ドロップして
                        </Text>
                        <Text color="gray.500">
                            HTMLを自動生成します
                        </Text>
                    </VStack>
                )}
            </Center>
        </Box>
    );
}