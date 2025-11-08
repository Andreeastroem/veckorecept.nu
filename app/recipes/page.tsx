// Display all current recipes in a paginated list

import { HeaderLayout, MainLayout } from "../components/PageLayout";
import PaginatedRecipeLinkList from "./components/PaginatedRecipeLinkList";

type PageProps = {};

export default function Page() {
  const filterOptions = [];

  return (
    <>
      <HeaderLayout />
      <MainLayout>
        <PaginatedRecipeLinkList />
      </MainLayout>
    </>
  );
}
