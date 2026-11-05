export default function NaslovV2({ nad, naslov }: { nad: string; naslov: string }) {
  return (
    <div className="lg:px-3">
      <p className="v2-nad">{nad}</p>
      <h2 className="v2-h2 mt-2.5">{naslov}</h2>
    </div>
  );
}
