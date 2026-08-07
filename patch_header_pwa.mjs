import fs from 'fs';

let content = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

// First remove existing isInstallable logic and variables from Header.tsx
content = content.replace(/const \[deferredPrompt, setDeferredPrompt\] = useState<any>\(null\);\n\s*const \[isInstallable, setIsInstallable\] = useState\(false\);\n\n\s*useEffect\(\(\) => \{\n\s*const handleBeforeInstallPrompt = \(e: any\) => \{\n\s*\/\/ Prevent the mini-infobar from appearing on mobile\n\s*e\.preventDefault\(\);\n\s*\/\/ Stash the event so it can be triggered later\.\n\s*setDeferredPrompt\(e\);\n\s*\/\/ Update UI notify the user they can install the PWA\n\s*setIsInstallable\(true\);\n\s*\};\n\s*window\.addEventListener\('beforeinstallprompt', handleBeforeInstallPrompt\);\n\n\s*return \(\) => \{\n\s*window\.removeEventListener\('beforeinstallprompt', handleBeforeInstallPrompt\);\n\s*\};\n\s*\}, \[\]\);\n\n\s*const handleInstallClick = async \(\) => \{\n\s*if \(!deferredPrompt\) return;\n\n\s*\/\/ Show the install prompt\n\s*deferredPrompt\.prompt\(\);\n\n\s*\/\/ Wait for the user to respond to the prompt\n\s*const \{ outcome \} = await deferredPrompt\.userChoice;\n\s*\/\/ We've used the prompt, and can't use it again, throw it away\n\s*setDeferredPrompt\(null\);\n\s*setIsInstallable\(false\);\n\s*\};\n\n/, '');

// Remove the install banner HTML
content = content.replace(/\{\/\* Install App Banner \(shows only when installable\) \*\/\}\n\s*\{isInstallable && \(\n\s*<div className="bg-primary text-white text-xs py-2 px-4 flex items-center justify-between sm:justify-center gap-4">\n\s*<span className="font-medium">Get the App for a better experience!<\/span>\n\s*<button \n\s*onClick=\{handleInstallClick\}\n\s*className="flex items-center gap-1.5 bg-white text-primary px-3 py-1 rounded-full font-bold hover:bg-gray-100 transition-colors"\n\s*>\n\s*<Download size=\{14\} \/> Install App\n\s*<\/button>\n\s*<\/div>\n\s*\)\}\n\n/, '');

// Update imports
if (!content.includes('InstallPWA')) {
  content = content.replace("import { Logo } from '../ui/Logo';", "import { Logo } from '../ui/Logo';\nimport { InstallPWA } from '../ui/InstallPWA';");
}

// Add InstallPWA to the top banner
content = content.replace(
  '<div className="bg-dark text-white text-xs py-2 text-center flex items-center justify-center gap-2">',
  '<div className="bg-dark text-white text-xs py-2 text-center flex items-center justify-center gap-2 relative">\n        <InstallPWA />'
);

fs.writeFileSync('src/components/layout/Header.tsx', content);
