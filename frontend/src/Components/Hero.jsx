import HeroImg from '../assets/hero.png';
import { IoLogoLinkedin,IoLogoGithub  } from "react-icons/io5";
export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row  px-5 py-32 bg-secondary justify-center">
      <div className='flex flex-col md:w-1/2'>
      <h1 className=' text-white text-6xl font-hero'>Hi, <br/>Im <span className='text-black'>Hari Hara Raja Sudhan</span>
      <p className='text-2xl'> Im a MERN-Stack Developer</p>
      </h1>
      <div className='flex py-10'>
        <a href="#" className='pr-5 hover:text-white'> <IoLogoLinkedin size={40} /></a>
        <a href="#" className='pr-5 hover:text-white' ><IoLogoGithub size={40}/></a>
      </div>
      </div>
    <img src={HeroImg} alt="Hero Image" className='md:w-1/3' />
    </section>
  )
}
  