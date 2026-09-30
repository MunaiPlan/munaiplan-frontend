import { FC } from 'react';
import LandingPage from '../features/landing/LandingPage';
import { useAuth } from '../hooks/useAuth';
import Home from './HomePage';

/** "/": the landing page for visitors, the workspace overview once signed in. */
const IndexPage: FC = () => (useAuth() ? <Home /> : <LandingPage />);

export default IndexPage;
