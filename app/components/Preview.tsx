import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

interface PreviewProps {
    html: string;
}

export default function Preview({ html }: PreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const iframe = iframeRef.current;
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc) {
                iframeDoc.open();
                iframeDoc.write(`
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <title>Preview</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    line-height: 1.6;
                                    color: #333;
                                    margin: 0;
                                    padding: 20px;
                                }
                            </style>
                        </head>
                        <body>${html}</body>
                    </html>
                `);
                iframeDoc.close();
            }
        }
    }, [html]);

    return (
        <Box height="100%" width="100%">
            <iframe
                ref={iframeRef}
                title="Preview"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            />
        </Box>
    );
}