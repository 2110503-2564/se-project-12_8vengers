// export default async function getAverageRating(coworkingSpaceId: string, token: string) {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reservations/average/${coworkingSpaceId}`,
//     {
//       method: "GET",
//       headers: {
//         authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch average rating");
//   }

//   const data = await response.json();

//   // แก้ตรงนี้ให้ return ทั้ง average และ count
//   return {
//     average: data.average || 0,
//     count: data.count || 0,
//   };
// }
export default async function getAverageRating(coWorkingSpaceId: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/ratings/average/${coWorkingSpaceId}`;
  console.log("Fetching average rating from:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Backend error response:", errText);
    throw new Error("Failed to fetch average rating");
  }

  const data = await response.json();
  console.log("Average rating response:", data);

  return {
    average: data.data.averageRating || 0,
    count: data.data.count || 0,
  };
}
