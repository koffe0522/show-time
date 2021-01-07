import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Header from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';

type Layout = {
  children: JSX.Element | JSX.Element[] | HTMLElement | HTMLElement[];
};

const useStyles = makeStyles({
  root: {
    marginTop: 64,
  },
});

export default function Main(props: Layout): JSX.Element {
  const { children } = props;
  const classes = useStyles();

  return (
    <>
      <Header />
      <main className={classes.root}>
        <Container fixed>{children}</Container>
      </main>
      <Footer />
    </>
  );
}
