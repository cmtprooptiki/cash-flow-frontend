import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const links = [
        { path: '/tags', label: 'Tags' },
        { path: '/ypoquery', label: 'Υποχρεώσεις' },
        { path: '/doseis', label: 'Δόσεις' },
        
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

export default Breadcrumbs;
