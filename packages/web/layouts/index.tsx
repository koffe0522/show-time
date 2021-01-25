import Header from '@/components/organisms/Header';

type Layout = {
  children: JSX.Element | JSX.Element[] | HTMLElement | HTMLElement[];
};

export default function Main(props: Layout): JSX.Element {
  const { children } = props;

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
