import { createSignal } from "solid-js";
import EncryptForm from "~/components/EncryptForm";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Home() {
  const [selectedTab, setSelectedTab] = createSignal("encrypt")
  return (
    <main class="h-screen max-w-lg flex flex-col items-center justify-center gap-8 mx-auto bg-background text-foreground p-4">
      <h1 class="font-bold text-5xl">
        文本 <span classList={{ 'rotate-180': selectedTab() === 'decrypt' }} class="mx-2 inline-block transition-transform duration-500">→</span> 😀
      </h1>
      <Tabs value={selectedTab()} onChange={setSelectedTab} class="w-full">
        <TabsList>
          <TabsTrigger value="encrypt">加密</TabsTrigger>
          <TabsTrigger value="decrypt">解密</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="encrypt">
          <EncryptForm />
        </TabsContent>
        <TabsContent value="decrypt">

        </TabsContent>
      </Tabs>
    </main>
  );
}
