'use client'
import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Chat from "./components/Chat";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
export default function Home() {
  const [html, setHtml] = useState<string>("");

  const handleHtmlGenerated = (generatedHtml: string) => {
    setHtml(generatedHtml);
  };

  return (
      <Flex h="100vh">
        <Box flex={1}><Chat onHtmlGenerated={handleHtmlGenerated} /></Box>
        <Box flex={1}><Editor html={html} onChange={setHtml} /></Box>
        <Box flex={1}><Preview html={html} /></Box>
      </Flex>
  );
}