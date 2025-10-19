import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Lost and Found System. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;