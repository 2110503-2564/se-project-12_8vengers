import Link from "next/link";
import Card from "./Card";
import { CoWorkingSpaceItem, CoWorkingSpaceJson } from "../../interface";

export default async function CoWorkingSpaceList({ coopJson }: { coopJson: CoWorkingSpaceJson }) {
  const JsonYay = await coopJson;
  const coWorkingSpaceDetail = JsonYay.data;

  return (
    <div className="px-6 py-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {coWorkingSpaceDetail.map((coop: CoWorkingSpaceItem) => (
      <Link key={coop._id} href={`/coworkingspace/${coop._id}`} className="block">
        <div className="h-full">
          <Card
            coopName={coop.name}
            address={coop.address}
            tel={coop.tel}
            open_time={coop.open_time}
            close_time={coop.close_time}
            price={coop.price}
            desc={coop.desc}
          />
        </div>
      </Link>
    ))}
  </div>
</div>

  );
}
