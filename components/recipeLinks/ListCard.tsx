import { DataModel } from "@/convex/_generated/dataModel";
import { Card, CardAction, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  recipe: DataModel["recipeLinks"]["document"];
};

export default function RecipeLinkListCard({ recipe }: Props) {
  return (
    <li>
      <Link href={"/recipe/" + recipe.slug}>
        <Card>
          <CardHeader>
            <CardTitle>{recipe.name}</CardTitle>
            <CardAction>
              <ArrowUpRight />
            </CardAction>
          </CardHeader>
        </Card>
      </Link>
    </li>
  );
}
