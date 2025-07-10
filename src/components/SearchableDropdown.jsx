import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Plus } from 'lucide-react';

const SearchableDropdown = ({ 
  placeholder = "Search...", 
  value = "", 
  options = [], 
  onSelect, 
  onAddNew,
  addNewText = "Add New",
  width = "200px",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter options based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm('');
      // Focus the input when opening
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect(null);
    setSearchTerm('');
  };

  const handleAddNew = () => {
    if (onAddNew && searchTerm.trim()) {
      onAddNew(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const hasExactMatch = filteredOptions.some(option => 
    option.label.toLowerCase() === searchTerm.toLowerCase()
  );

  const showAddNew = onAddNew && searchTerm.trim() && !hasExactMatch;

  return (
    <div className="relative z-50" ref={dropdownRef} style={{ minWidth: width }}>
      {/* Main Input */}
      <div 
        className={`
          flex items-center w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white cursor-pointer
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
        onClick={handleInputClick}
      >
        <Search className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
        
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="flex-1 outline-none bg-transparent text-sm"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={disabled}
            autoFocus
          />
        ) : (
          <span className={`flex-1 text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>
            {value || placeholder}
          </span>
        )}
        
        <div className="flex items-center space-x-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="fixed z-[99999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-2xl max-h-60 overflow-y-auto" style={{ 
          left: dropdownRef.current?.getBoundingClientRect().left + 'px',
          top: (dropdownRef.current?.getBoundingClientRect().bottom + 4) + 'px',
          width: dropdownRef.current?.getBoundingClientRect().width + 'px'
        }}>
          {/* Search Results */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleOptionSelect(option)}
              >
                <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                {option.subtitle && (
                  <div className="text-xs text-gray-500 mt-1">{option.subtitle}</div>
                )}
              </div>
            ))
          ) : searchTerm.trim() ? (
            <div className="px-3 py-2 text-gray-500 text-sm">
              No results found for "{searchTerm}"
            </div>
          ) : (
            <div className="px-3 py-2 text-gray-500 text-sm">
              Type to search...
            </div>
          )}

          {/* Add New Option */}
          {showAddNew && (
            <div
              className="px-3 py-2 hover:bg-green-50 cursor-pointer border-t border-gray-200 bg-green-50"
              onClick={handleAddNew}
            >
              <div className="flex items-center text-green-700 font-medium text-sm">
                <Plus className="w-4 h-4 mr-2" />
                {addNewText}: "{searchTerm}"
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;