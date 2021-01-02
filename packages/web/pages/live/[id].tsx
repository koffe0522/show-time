import { useRouter } from "next/router";


export default function LiveRoom() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <h1>{id}</h1>
  )
}