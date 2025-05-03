// "use client";
// import React from "react";
// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { User } from "next-auth";
// import { Button } from "./ui/button";

// const Navbar = () => {
//   const { data: session } = useSession();
//   const user: User = session?.user as User;
//   return (
//     <nav className="p-4 md:p-6 shadow-md">
//       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
//         <a href="#" className="text-xl font-bold mb-4 md:mb-0">
//           Mystry Message
//         </a>
//         {session ? (
//           <>
//             <span className="mr-4">
//               Welcome, {user?.username || user?.email}
//             </span>
//             <Button className="w-full md:w-auto" onClick={() => signOut()}>
//               Logout
//             </Button>
//           </>
//         ) : (
//           <Link href="/sign-in">
//             <Button className="w-full md:w-auto">Login</Button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import type { User } from "next-auth";
import { Button } from "./ui/button";
import { MessageSquare, Menu, X, LogOut, UserIcon } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#e6f7f0] shadow-sm border-b border-[#00a676]/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-[#00a676]/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-[#00a676]" />
              </div>
              <span className="text-xl font-bold text-[#00a676] hidden sm:block">
                Mystery Message
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#00a676]/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-[#00a676]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username || user?.email}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="border-[#00a676] text-[#00a676] hover:bg-[#00a676] hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link href="/sign-in">
                  <Button
                    variant="outline"
                    className="border-[#00a676] text-[#00a676] hover:bg-[#00a676] hover:text-white transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-[#00a676] hover:bg-[#00a676]/90 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-[#00a676]/10 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#00a676]/10 pt-4">
            {session ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 p-2 bg-[#00a676]/5 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-[#00a676]/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-[#00a676]" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.username || user?.email}
                  </span>
                </div>
                <Button
                  onClick={() => signOut()}
                  className="w-full bg-[#00a676] hover:bg-[#00a676]/90 text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link href="/sign-in" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-[#00a676] text-[#00a676] hover:bg-[#00a676]/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full bg-[#00a676] hover:bg-[#00a676]/90 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
