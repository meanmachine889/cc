import Feature from "./bleh"

const About = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between w-full px-4 sm:px-6 md:px-13 pb-6 sm:pb-9 md:pb-12 bg-black text-white gap-6 md:gap-0">
        <p className="w-full md:w-[30%] text-2xl sm:text-3xl md:text-5xl">About Us</p>
        <div className="w-full md:w-[50%]">
          <p className="leading-snug text-xl sm:text-2xl md:text-4xl">
            Empowering a Transparent Future for Carbon Markets
          </p>
          <p className="mt-3 sm:mt-4 md:mt-5 text-sm sm:text-base md:text-lg">
            We&apos;re building a reliable blockchain-based system that transforms how carbon credits are created, traded,
            and tracked. By combining Solana&apos;s efficiency with built-in compliance and KYC verification, we help
            industries securely tokenize real-world assets, ensure transparency in every transaction, and simplify
            participation in the global carbon economy.
          </p>
        </div>
      </div>
      <Feature />
    </div>
  )
}

export default About
