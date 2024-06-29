"use client"

import React, { useState } from 'react';
import { Poppins, Raleway } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});
const raleway = Raleway({
    weight: ['100', '400', '500', '600', '700', '800'],
    subsets: ['latin'],
});

function page() {
    const [menu, setMenu] = useState(false);

    return (
        <div className="flex flex-col h-screen ">
            <div className="w-screen py-6 px-10 flex justify-between items-center">
                <Link href="/" className={`${raleway.className} text-2xl font-bold cursor-pointer`}>Luna</Link>

                <div className='hidden md:flex justify-center items-center space-x-10'>
                    <Link href="/about-us" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>About Us</Link>
                    <a href="https://www.sagarrchavan.in/courses/475162" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Education</a>
                    <a href="https://www.youtube.com/watch?v=YnQNfrwtEDI&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=22" className={`${poppins.className} hidden md:flex text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Youtube</a>
                    <Link href="/terms-conditions" className={`${poppins.className} text-sm font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
                </div>


                <div className='md:hidden '>
                    {menu ? <img src="/close.png" alt="close" className='w-5 h-5' onClick={() => setMenu(false)} /> : <img src="/menu.png" alt="menu" className='w-5 h-5' onClick={() => setMenu(true)} />
                    }
                </div>

            </div>

            <div className="bg-gray-900 h-[1px]" />

            {menu ? (
                <div className='flex flex-col justify-start items-center h-screen my-10 space-y-10 '>
                    <Link href="/about-us" className={`${poppins.className}text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>About Us</Link>
                    <a href="https://www.sagarrchavan.in/courses/475162" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Education</a>
                    <a href="https://www.youtube.com/watch?v=YnQNfrwtEDI&list=PLo8-DS458G5vCliMQ9GcQjPMwFYFR3UqI&index=22" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Youtube</a>
                    <Link href="/terms-conditions" className={`${poppins.className} text-md font-medium cursor-pointer hover:ease-in transition  hover:text-gray-400`}>Terms & Conditions</Link>
                </div>
            )
                :

                (<>
                    <div className='flex flex-col justify-center items-center w-screen py-10 border-t lg:px-20 px-6 border-gray-800'>
                        <h1 className={`${poppins.className} lg:text-5xl text-3xl font-bold`}>Terms and Conditions for Luna</h1>
                        <ul className={`${poppins.className} list-disc ml-8 pt-5 lg:pt-10 lg:space-y-5`}>
                            <li>
                                <strong>Introduction:</strong> Welcome to Luna. These Terms and Conditions govern your use of the Luna website and services, including all features and functionalities, recommendations, and user interfaces, as well as all content and software associated with our service.
                            </li>
                            <li>
                                <strong>Acceptance of Terms:</strong> By using Luna's services, you agree to be bound by these Terms and Conditions and to review our Privacy Policy, which describes our practices concerning personal information that you provide or that we collect. If you do not agree to these terms, you must not use our services.
                            </li>
                            <li>
                                <strong>Changes to Terms:</strong> Luna reserves the right, at our discretion, to change, modify, add, or remove portions of these Terms at any time by posting the amended Terms to our website. Please check these Terms periodically for changes.
                            </li>
                            <li>
                                <strong>Service Description:</strong> Luna provides an online platform that connects villa owners with potential travelers. Villa owners receive direct leads from travelers based on matching criteria. The services include, but are not limited to, lead generation, lead filtering, and direct communication facilitation.
                            </li>
                            <li>
                                <strong>User Responsibilities:</strong>
                                <ul className="list-disc ml-8">
                                    <li>
                                        <strong>Villa Owners:</strong> You are responsible for maintaining the accuracy of the information presented in your listings, responding to traveler inquiries in a timely manner, and ensuring that your interaction with potential travelers complies with all applicable laws and regulations.
                                    </li>
                                    <li>
                                        <strong>Travelers:</strong> You agree to provide honest and accurate information regarding your travel needs and budget. You are expected to communicate respectfully with villa owners.
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>Privacy:</strong> Your privacy is important to us. Please read our Privacy Policy, which governs the processing of all personal data collected from you in connection with your use of the Luna service.
                            </li>
                            <li>
                                <strong>Payment Terms:</strong> Details about the financial transactions, including any fees associated with the services provided by Luna, payment methods, refunds, and cancellations, will be governed by our Payment Terms.
                            </li>
                            <li>
                                <strong>Intellectual Property:</strong> All content provided on Luna’s platform, including text, graphics, logos, images, and software, is the property of Luna or its licensors and is protected by copyright and intellectual property laws.
                            </li>
                            <li>
                                <strong>Cancellation and Termination:</strong> Luna reserves the right to terminate or restrict your use of our service if you violate these Terms and Conditions or are engaged in illegal or fraudulent use of the service.
                            </li>
                            <li>
                                <strong>Disclaimers:</strong> Luna provides its service on an "as is" and "as available" basis. You therefore use the Luna service at your own risk. Luna does not guarantee that its service will be uninterrupted or error-free.
                            </li>
                            <li>
                                <strong>Limitation of Liability:</strong> To the fullest extent permitted by applicable law, Luna shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                            </li>
                            <li>
                                <strong>Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Luna operates, without regard to its conflict of law provisions.
                            </li>
                            <li>
                                <strong>Dispute Resolution:</strong> Any disputes arising from the use of Luna services will be resolved through final and binding arbitration, except as set forth under Exceptions to Agreement to Arbitrate in this Section.
                            </li>
                            <li>
                                <strong>General Provisions:</strong> These Terms constitute the entire agreement between you and Luna regarding the use of Luna services. If any provision of these Terms is held to be invalid or unenforceable, that provision will be enforced to the maximum extent permissible, and the other provisions of these Terms will remain in full force and effect.
                            </li>
                            <li>
                                <strong>Contact Information:</strong> For any questions regarding these Terms and Conditions, please contact us via our designated contact methods on our platform.
                            </li>
                        </ul>
                        <h1 className={`${poppins.className} text-md font-normal`}></h1>


                    </div>
                </>)}


        </div >
    );
}

export default page;
