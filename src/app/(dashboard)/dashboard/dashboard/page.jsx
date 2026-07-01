import Link from "next/link";
import Image from "next/image";

const Dashboard = () => {
  return (
    <main>
      <div className="navbar bg-gray-400">
        <div className="navbar-start flex-1">
          <div className="dropdown lg:hidden">
            <label htmlFor="my-drawer-2" className="btn btn-ghost drawer-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </label>
          </div>

          <Link href="/" className="flex gap-2 flex-center">
            <Image
              src="/assets/icon/logo.png"
              alt="logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="navbar-end">
          <div className="flex mx-4">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="badge badge-sm indicator-item">8</span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <span className="text-lg font-bold">8 Items</span>
                  <span className="text-info">Subtotal: $999</span>
                  <div className="card-actions">
                    <button className="btn btn-primary btn-block">
                      View cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown dropdown-end mt">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <Image
                    alt="User avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                    height={400}
                    width={600}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-start justify-start">
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <button>Dashboard</button>
            </li>
            <li>
              <button>Categories</button>
              <ul className="sub-menu">
                <li>
                  <button>Add Categories</button>
                </li>
                <li>
                  <button>All Categories</button>
                </li>
              </ul>
            </li>
            <li>
              <button>Course</button>
              <ul className="sub-menu">
                <li>
                  <button>Add Course</button>
                </li>
                <li>
                  <button>All Course</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
