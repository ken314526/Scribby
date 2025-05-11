
import { Layout } from '@/components/Layout';
import { HomePage } from '@/components/HomePage';

const Index = ({ editor = false }: { editor?: boolean }) => {
  return editor ? <Layout /> : <HomePage />;
};

export default Index;
