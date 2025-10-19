import React, { useState, useMemo, useEffect } from 'react';

// --- API Configuration ---
const API_URL = 'http://localhost:5000/api';

// --- Helper Components ---

// SVG Icons
const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 text-slate-500 dark:text-slate-400">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

// Search Bar Component
const SearchBar = ({ onSearch, placeholder }) => (
  <div className="relative w-full max-w-md"><input type="search" placeholder={placeholder || "Search for items..."} className="w-full p-3 pl-10 text-sm bg-slate-100 dark:bg-slate-700 border-2 border-transparent dark:text-slate-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" onChange={(e) => onSearch(e.target.value)} /><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
);

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => (
  <div className="flex flex-wrap gap-2">{categories.map(category => (<button key={category} onClick={() => onSelectCategory(category)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${selectedCategory === category ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'}`}>{category}</button>))}</div>
);

// Item Card Component
const ItemCard = ({ item, type, userRole, onClaim, onApproveClaim, onFound }) => {
  const statusColors = { 
      Found: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 
      Claimed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      Pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      Returned: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
      Lost: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  };

  const currentStatus = item.status;

  return (<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1.5 transition-transform duration-300 ease-in-out group border border-slate-200 dark:border-slate-700 flex flex-col"><div className="relative"><img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300" onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x400/e2e8f0/4a5568?text=Image+Not+Found`; }} /><span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${statusColors[currentStatus]}`}>{currentStatus}</span></div><div className="p-5 flex flex-col flex-grow"><p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{item.category}</p><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 truncate">{item.name}</h3><p className="text-slate-600 dark:text-slate-400 text-sm mb-4 h-10 overflow-hidden">{item.description}</p>
  {item.status !== 'Returned' && <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4"><LocationPinIcon /><span>{type === 'found' ? 'Found at:' : 'Last seen at:'} <span className="font-semibold text-slate-700 dark:text-slate-300">{item.location}</span></span></div>}
  
  {item.status === 'Returned' && (
      <div className="text-sm space-y-2 mb-4 border-t pt-4 mt-auto border-slate-200 dark:border-slate-700">
          <p><strong className="text-slate-600 dark:text-slate-300">Finder:</strong> {item.senderName || 'N/A'}</p>
          <p><strong className="text-slate-600 dark:text-slate-300">Recipient:</strong> {item.recipientName || 'N/A'}</p>
      </div>
  )}
  
  <div className="mt-auto space-y-2">
    {type === 'found' && userRole === 'user' && currentStatus === 'Found' && (
        <button onClick={() => onClaim(item)} className="w-full bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 ease-in-out">Claim Item</button>
    )}
    {type === 'lost' && userRole === 'user' && currentStatus === 'Lost' && (
        <button onClick={() => onFound(item)} className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300 ease-in-out">I Have This!</button>
    )}
    {userRole === 'admin' && currentStatus === 'Pending' && (
        <button onClick={() => onApproveClaim(item)} className="w-full bg-green-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300 ease-in-out">Approve Claim</button>
    )}
  </div></div></div>);
};

// Theme Toggle Component
const ThemeToggle = ({ theme, onToggle }) => (<button onClick={onToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300" aria-label="Toggle theme">{theme === 'light' ? <MoonIcon /> : <SunIcon />}</button>);

// --- Modals ---
const ModalWrapper = ({ isOpen, onClose, children }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all duration-300" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const ReportItemModal = ({ isOpen, onClose, type, onSubmit }) => {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Other');
    const [reporterName, setReporterName] = useState('');
    const [reporterContact, setReporterContact] = useState('');

    const handleClose = () => {
        setItemName('');
        setDescription('');
        setLocation('');
        setCategory('Other');
        setReporterName('');
        setReporterContact('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = { name: itemName, description, location, category, status: type, reporterName, reporterContact };
        onSubmit(newItem);
        handleClose();
    };

    return (<ModalWrapper isOpen={isOpen} onClose={handleClose}><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Report an Item</h2><button onClick={handleClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button></div><form onSubmit={handleSubmit}><div className="space-y-4"><input type="text" placeholder="Item Name (e.g., 'Red Scarf')" value={itemName} onChange={e => setItemName(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required /><textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg h-24" required></textarea><input type="text" placeholder={type === 'Found' ? "Location Found" : "Last Known Location"} value={location} onChange={e => setLocation(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required /><select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none"><option>Electronics</option><option>Accessories</option><option>Keys</option><option>Apparel</option><option>ID Cards</option><option>Other</option></select>
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4"><p className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Your Contact Information</p><input type="text" placeholder="Your Name" value={reporterName} onChange={e => setReporterName(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required /><input type="text" placeholder="Your Email or Phone" value={reporterContact} onChange={e => setReporterContact(e.target.value)} className="w-full p-3 mt-2 bg-slate-100 dark:bg-slate-700 rounded-lg" required /></div>
    <div><label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Upload Image (Optional)</label><input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/></div></div><button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 mt-6 transition-colors">Submit Report</button></form></ModalWrapper>);
};

const ClaimItemModal = ({ isOpen, onClose, item, onSubmit }) => {
    const [proof, setProof] = useState('');
    const [claimerName, setClaimerName] = useState('');
    const [claimerContact, setClaimerContact] = useState('');

    const handleClose = () => {
        setProof('');
        setClaimerName('');
        setClaimerContact('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(item.id, { proof, claimerName, claimerContact });
        handleClose();
    };

    return (<ModalWrapper isOpen={isOpen} onClose={handleClose}><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Claim "{item?.name}"</h2><button onClick={handleClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button></div><p className="text-slate-600 dark:text-slate-400 mb-4">To claim this item, please provide proof of ownership and your contact details.</p><form onSubmit={handleSubmit}><div className="space-y-4"><textarea placeholder="Proof of ownership (e.g., color, specific marks, etc.)" value={proof} onChange={e => setProof(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg h-24" required></textarea>
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4"><p className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-300">Your Contact Information</p><input type="text" placeholder="Your Name" value={claimerName} onChange={e => setClaimerName(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required /><input type="text" placeholder="Your Email or Phone" value={claimerContact} onChange={e => setClaimerContact(e.target.value)} className="w-full p-3 mt-2 bg-slate-100 dark:bg-slate-700 rounded-lg" required /></div></div>
    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 mt-6 transition-colors">Submit Claim</button></form></ModalWrapper>);
}

const AdminLoginModal = ({ isOpen, onClose, onLogin, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => {
        setUsername('');
        setPassword('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (<ModalWrapper isOpen={isOpen} onClose={handleClose}>
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Administrator Login</h2><button onClick={handleClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button></div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Please enter your credentials to access administrator privileges.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 mt-2 transition-colors">Login</button>
        </form>
    </ModalWrapper>);
}

const AdminRegistrationModal = ({ isOpen, onClose, onRegister, error }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClose = () => {
        setUsername('');
        setPassword('');
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(username, password);
    };

    return (<ModalWrapper isOpen={isOpen} onClose={handleClose}>
        <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Administrator Registration</h2><button onClick={handleClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button></div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">No administrator found. Please create the admin account to manage the system.</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Choose a Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required />
            <input type="password" placeholder="Choose a Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-slate-100 dark:bg-slate-700 rounded-lg" required />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 mt-2 transition-colors">Register</button>
        </form>
    </ModalWrapper>);
}


// --- Page Components ---

const HomePage = ({ onNavigate, onReport }) => {
    return (
        <div className="text-center pt-8 pb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">Welcome to FindMe</h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12">The central hub for all lost and found items on campus.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Lost Items Section */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Lost an Item?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Report items you've lost and browse the gallery of found items to see if someone has turned it in.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => onReport('Lost')} className="flex-1 bg-red-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-red-700 transition-colors">Report a Lost Item</button>
                        <button onClick={() => onNavigate('browseFound')} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Browse Found Items</button>
                    </div>
                </div>

                {/* Found Items Section */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Found an Item?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Help reunite an item with its owner. Report what you've found or check the list of items reported lost.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => onReport('Found')} className="flex-1 bg-green-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-green-700 transition-colors">Report a Found Item</button>
                        <button onClick={() => onNavigate('browseLost')} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Browse Lost Items</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BrowseItemsPage = ({ items, title, type, userRole, onClaim, onApproveClaim, onNavigate, onFound }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = useMemo(() => ['All', ...new Set(items.map(item => item.category))], [items]);
  
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchTerm, selectedCategory]);

    return (
    <div>
        <button onClick={() => onNavigate('home')} className="mb-8 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
        </button>
        <div className="text-center mb-12"><h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">{title}</h1></div>
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-6 items-center border border-slate-200 dark:border-slate-700">
            <div className="w-full md:flex-1"><SearchBar onSearch={setSearchTerm} placeholder={`Search for ${type} items...`} /></div>
            <div className="w-full md:w-auto"><CategoryFilter categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} /></div>
        </div>
        {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map(item => (<ItemCard key={item.id} item={item} type={type} userRole={userRole} onClaim={onClaim} onApproveClaim={onApproveClaim} onFound={onFound} />))}
            </div>
        ) : (
            <div className="text-center py-16"><h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No Items Found</h3><p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filter settings, or check back later.</p></div>
        )}
    </div>
    );
};

const ReturnHistoryPage = ({ items, onNavigate }) => (
    <div>
        <button onClick={() => onNavigate('home')} className="mb-8 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Home
        </button>
        <div className="text-center mb-12"><h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-3">Return History</h1></div>
        {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {items.map(item => (<ItemCard key={item.id} item={item} type="found" userRole="admin"/>))}
            </div>
        ) : (
            <div className="text-center py-16"><h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">No Returned Items Yet</h3><p className="text-slate-500 dark:text-slate-400 mt-2">Once an admin approves a claim, the item will appear here.</p></div>
        )}
    </div>
);

// --- Main App Component ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentView, setCurrentView] = useState('home');
  const [userRole, setUserRole] = useState('user');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState('Lost');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [currentItemToClaim, setCurrentItemToClaim] = useState(null);
  const [loginError, setLoginError] = useState('');

  // State for items
  const [allItems, setAllItems] = useState([]);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
        const response = await fetch(`${API_URL}/items`);
        const data = await response.json();
        setAllItems(data);
    } catch (error) {
        console.error("Failed to fetch items:", error);
    } finally {
        setIsDataLoading(false);
    }
  };

  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) { setTheme(savedTheme); if(savedTheme === 'dark') document.documentElement.classList.add('dark'); } 
    else if (isDarkMode) { setTheme('dark'); document.documentElement.classList.add('dark'); }
    
    fetchData();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') { document.documentElement.classList.add('dark'); } 
    else { document.documentElement.classList.remove('dark'); }
  };
  
  const handleReportClick = (type) => { setReportModalType(type); setIsReportModalOpen(true); };
  const handleClaimClick = (item) => { setCurrentItemToClaim(item); setIsClaimModalOpen(true); };
  
  const handleReportFormSubmit = async (newItem) => {
    try {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        });
        if(response.ok) {
            fetchData();
            setCurrentView(newItem.status === 'Found' ? 'browseFound' : 'browseLost');
        }
    } catch (error) {
        console.error("Failed to report item:", error);
    }
  };

  const handleClaimFormSubmit = async (itemId, claimDetails) => {
    try {
        const response = await fetch(`${API_URL}/items/${itemId}/claim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(claimDetails),
        });
        if(response.ok) fetchData();
    } catch (error) {
        console.error("Failed to submit claim:", error);
    }
  };

   const handleFoundLostItem = async (lostItem) => {
    try {
      const response = await fetch(`${API_URL}/items/${lostItem.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Pending' })
      });
      if(response.ok) {
        alert(`Thank you for finding the "${lostItem.name}"! The administrator will be notified.`);
        fetchData();
      }
    } catch(error) {
      console.error("Failed to update lost item status:", error);
    }
  };


  const handleApproveClaim = async (item) => {
    try {
        const response = await fetch(`${API_URL}/items/${item.id}/approve`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if(response.ok) fetchData();
    } catch(error) {
        console.error("Failed to approve claim:", error);
    }
  };

  const handleAdminToggle = async () => {
    if (isAdminAuthenticated) {
        setIsAdminAuthenticated(false);
        setUserRole('user');
    } else {
        setLoginError('');
        try {
            const response = await fetch(`${API_URL}/admin/exists`);
            const data = await response.json();
            if (data.exists) {
                setIsLoginModalOpen(true);
            } else {
                setIsRegistrationModalOpen(true);
            }
        } catch (error) {
            console.error("Could not check for admin existence:", error);
            alert("Could not connect to the server to check for admin account.");
        }
    }
  };

  const handleAdminLogin = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if(response.ok) {
            setIsAdminAuthenticated(true);
            setUserRole('admin');
            setIsLoginModalOpen(false);
            setLoginError('');
        } else {
            setLoginError(data.message || 'Invalid credentials.');
        }
    } catch(error) {
        setLoginError('An error occurred. Please try again.');
    }
  };

  const handleAdminRegister = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/admin/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
            setIsAdminAuthenticated(true);
            setUserRole('admin');
            setIsRegistrationModalOpen(false);
        } else {
            setLoginError(data.message || 'Registration failed.');
        }
    } catch (error) {
        setLoginError('An error occurred during registration.');
    }
  };
  
  const foundItems = allItems.filter(item => item.status === 'Found' || item.status === 'Pending');
  const returnedItems = allItems.filter(item => item.status === 'Returned');
  const lostItems = allItems.filter(item => item.status === 'Lost' || item.status === 'Pending');

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300 flex flex-col">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div onClick={() => setCurrentView('home')} className="text-2xl font-bold text-indigo-600 dark:text-indigo-500 cursor-pointer">Find<span className="text-slate-700 dark:text-slate-300">Me</span></div>
            <div className="flex items-center gap-4">
                {isAdminAuthenticated && <button onClick={() => setCurrentView('returnHistory')} className="hidden sm:block bg-purple-600 text-white font-bold py-2 px-5 rounded-full hover:bg-purple-700 transition-colors duration-300">Return History</button>}
                <label htmlFor="admin-toggle" className="flex items-center cursor-pointer"><span className="text-sm font-semibold mr-2">{isAdminAuthenticated ? 'Admin View' : 'User View'}</span><div className="relative"><input type="checkbox" id="admin-toggle" className="sr-only" checked={isAdminAuthenticated} onChange={handleAdminToggle} /><div className="block bg-slate-200 dark:bg-slate-700 w-12 h-6 rounded-full"></div><div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAdminAuthenticated ? 'translate-x-6 bg-indigo-500' : ''}`}></div></div></label>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12 flex-grow">
        {currentView === 'home' && <HomePage onNavigate={setCurrentView} onReport={handleReportClick} />}
        {currentView === 'browseFound' && <BrowseItemsPage items={foundItems} title="Found Items" type="found" userRole={userRole} onClaim={handleClaimClick} onApproveClaim={handleApproveClaim} onNavigate={setCurrentView} />}
        {currentView === 'browseLost' && <BrowseItemsPage items={lostItems} title="Lost Items" type="lost" userRole={userRole} onFound={handleFoundLostItem} onApproveClaim={handleApproveClaim} onNavigate={setCurrentView} />}
        {currentView === 'returnHistory' && <ReturnHistoryPage items={returnedItems} onNavigate={setCurrentView} />}
      </main>

      <ReportItemModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} type={reportModalType} onSubmit={handleReportFormSubmit}/>
      {currentItemToClaim && <ClaimItemModal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} item={currentItemToClaim} onSubmit={handleClaimFormSubmit}/>}
      <AdminLoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleAdminLogin} 
        error={loginError}
      />
      <AdminRegistrationModal isOpen={isRegistrationModalOpen} onClose={() => setIsRegistrationModalOpen(false)} onRegister={handleAdminRegister} error={loginError} />


       <footer className="text-center py-8 mt-auto border-t border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} FindMe Lost & Found System. All rights reserved.</p>
        </footer>
    </div>
  );
}

