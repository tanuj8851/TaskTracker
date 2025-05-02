// components/Footer.js
export default function Footer() {
    return (
        <footer className="w-full bg-gray-800 text-white text-center py-4 mt-10">
            <p className="text-sm">&copy; {new Date().getFullYear()} TaskTracker Inc. All rights reserved.</p>
        </footer>
    );
}
