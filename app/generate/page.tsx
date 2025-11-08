import { Button } from "@/components/ui/button";
import { HeaderLayout, MainLayout } from "../components/PageLayout";

type Props = {};

export default function Page({}: Props) {
  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <h2>Generate your weekly recipes</h2>
        <Button variant={"outline"}>Hit it!</Button>
      </MainLayout>
    </>
  );
}
