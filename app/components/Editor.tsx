import { Box, Text } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { IAceEditorProps } from 'react-ace';

const AceEditor = dynamic<IAceEditorProps>(
    async () => {
        const ace = await import('react-ace');
        await import('ace-builds/src-noconflict/mode-html');
        await import('ace-builds/src-noconflict/theme-github');
        return ace.default;
    },
    { ssr: false }
);

interface EditorProps {
    html: string;
    onChange: (value: string) => void;
}

export default function Editor({ html, onChange }: EditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Box height="100vh" display="flex" flexDirection="column">
            <Text p={2}>Editor</Text>
            <Box flex={1} position="relative">
                {mounted && (
                    <AceEditor
                        mode="html"
                        theme="github"
                        onChange={onChange}
                        value={html}
                        name="html-editor"
                        editorProps={{ $blockScrolling: true }}
                        width="100%"
                        height="100%"
                        setOptions={{
                            useWorker: false
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}