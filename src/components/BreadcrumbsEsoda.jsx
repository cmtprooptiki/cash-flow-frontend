import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbsEsoda = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const links = [
        { path: '/customer', label: 'Πελάτες' },
        { path: '/erga', label: 'Έργα' },
        { path: '/paradotea', label: 'Παραδοτέα' },
        { path: '/timologia', label: 'Τιμολόγια' },
        { path: '/ek_tim', label: 'Εκχωριμένα Τιμολόγια' },
        // { path: '/ergacat', label: 'Κατηγορίες Εργων' },



        
    ];

    const filteredLinks = links.filter(link => link.path !== currentPath);

    return (
        <nav className="bg-gray-50 px-4 py-2 rounded-md shadow-sm mb-4 border border-gray-200">
            <ul className="flex items-center space-x-2 text-lg text-gray-700">
                {filteredLinks.map((link, index) => (
                    <li key={link.path} className="flex items-center">
                        <Link to={link.path} className="text-blue-600 hover:underline">
                            {link.label}
                        </Link>
                        {index < filteredLinks.length - 1 && (
                            <span className="mx-2 text-gray-400">›</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default BreadcrumbsEsoda;
