import Link from 'next/link';
import { Plane } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-xl font-bold">
          <Plane size={24} />
          <span>Bolt Travels</span>
        </Link>
        <ul className="flex space-x-4">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/destinations" className="hover:underline">Destinations</Link></li>
          <li><Link href="/book" className="hover:underline">Book Now</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;