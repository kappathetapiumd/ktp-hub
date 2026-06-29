import Limbo from './Limbo';

type Props = {
  searchParams: Promise<{ message?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { message } = await searchParams;

  return <Limbo message={message} />
}
