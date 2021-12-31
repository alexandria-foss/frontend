import { useNavigate } from 'react-router-dom';
import getToken from '../utils/getToken';
import Benefits from './home/Benefits';
import HowItWorks from './home/HowItWorks';
import Footer from './Footer';
import FAQ from './home/FAQ';

export default function Home() {
  const tokenObj = getToken();
  const navigate = useNavigate();

  return (
    <div className='home-page'>
     <div> { tokenObj
       ? navigate('/texts')
       : <div>
          <Benefits />
          <HowItWorks />
          <FAQ />
          <Footer />
        </div>
     } </div>
    </div>
  );
}
