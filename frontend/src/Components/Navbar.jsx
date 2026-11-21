import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faMessage } from '@fortawesome/free-regular-svg-icons';
import { faGear, faUserGroup, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ isSidebarExpanded, setisSidebarExpanded }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/check',
      label: 'Messages',
      icon: faMessage,
      isActive: location.pathname === '/check' || location.pathname.startsWith('/chatchat'),
    },
    {
      path: '/notification',
      label: 'Notification',
      icon: faBell,
      isActive: location.pathname === '/notification',
    },
    {
      path: '/nodata',
      label: 'Group',
      icon: faUserGroup,
      isActive: location.pathname === '/nodata',
    },
    {
      path: '/setting',
      label: 'Setting',
      icon: faGear,
      isActive: location.pathname === '/setting',
    },
  ];

  return (
    <div className="fixed bottom-0 w-full md:static z-20">
      {/* ── Desktop Slider Open/Close Floating Button ── */}
      {setisSidebarExpanded && (
        <button
          type="button"
          onClick={() => setisSidebarExpanded(!isSidebarExpanded)}
          className="hidden md:flex absolute -right-3.5 top-20 w-7 h-7 bg-[rgb(56,59,68)] hover:bg-[rgba(192,52,48,255)] border border-[rgb(85,95,94)] rounded-full items-center justify-center cursor-pointer shadow-lg z-30 text-white transition-all duration-200"
          title={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <FontAwesomeIcon icon={isSidebarExpanded ? faChevronLeft : faChevronRight} className="text-xs" />
        </button>
      )}

      {/* ── Mobile Bottom Navigation Bar (< md) ── */}
      <nav className="flex justify-evenly rounded-full mx-3 mb-2 py-2 bg-[rgba(56,59,68,255)] shadow-2xl border border-gray-700/60 md:hidden">
        {navItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition ${
              item.isActive
                ? 'bg-[rgba(192,52,48,255)] text-white shadow-md'
                : 'bg-[rgba(41,45,54,255)] text-[rgba(192,52,48,255)]'
            }`}
            title={item.label}
          >
            <FontAwesomeIcon icon={item.icon} className="text-lg" />
          </div>
        ))}
      </nav>

      {/* ── Desktop Vertical Sidebar Navigation (md:) ── */}
      <nav className="hidden md:flex flex-col gap-y-5 pt-28 pb-8 items-center w-full">
        {navItems.map((item) => (
          <div key={item.path} className="w-full flex justify-center">
            {isSidebarExpanded ? (
              /* Expanded State: Clean, Consistent Pill Button */
              <div
                onClick={() => navigate(item.path)}
                className={`w-[88%] flex items-center gap-3 px-3.5 py-2 rounded-full cursor-pointer transition-all duration-200 shadow-sm ${
                  item.isActive
                    ? 'bg-[rgba(192,52,48,255)] text-white shadow-md'
                    : 'bg-[rgb(56,59,68)] hover:bg-[rgb(70,74,85)] text-gray-200 hover:text-white'
                }`}
              >
                {/* Fixed-size Icon Circle */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.isActive ? 'bg-black/25' : 'bg-[rgba(41,45,54,255)]'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={item.isActive ? 'text-white text-base' : 'text-[rgba(192,52,48,255)] text-base'}
                  />
                </div>
                {/* Text Label - perfectly left-aligned */}
                <span className="text-[15px] font-semibold text-left tracking-wide whitespace-nowrap overflow-hidden text-ellipsis flex-1">
                  {item.label}
                </span>
              </div>
            ) : (
              /* Collapsed State: Centered Icon Circle */
              <div
                onClick={() => navigate(item.path)}
                className={`w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  item.isActive
                    ? 'bg-[rgba(192,52,48,255)] text-white shadow-md'
                    : 'bg-[rgba(41,45,54,255)] hover:bg-[rgb(56,59,68)] text-[rgba(192,52,48,255)] hover:text-white'
                }`}
                title={item.label}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={item.isActive ? 'text-white text-lg' : 'text-[rgba(192,52,48,255)] text-lg'}
                />
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Navbar;
