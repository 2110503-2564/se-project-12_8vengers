import Link from "next/link";
import Card from "./Card";
import { CoWorkingSpaceItem, CoWorkingSpaceJson } from "../../interface";

export default async function CoWorkingSpaceList({ coopJson }: { coopJson: CoWorkingSpaceJson }) {
  const JsonYay = await coopJson;
  const coWorkingSpaceDetail = JsonYay.data;

  return (
    <div>
      <div className="mx-5 flex flex-wrap justify-around gap-1 gap-y-[20px]">
        {coWorkingSpaceDetail.map((coop: CoWorkingSpaceItem) => (
          <Link key={coop._id} href={`/coworkingspace/${coop._id}`} className="w-1/5">
            <Card
              coopName={coop.name}
              address={coop.address}
              tel={coop.tel}
              open_time={coop.open_time}
              close_time={coop.close_time}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
