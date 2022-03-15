import { LogoutOutlined } from "@ant-design/icons";
import { useAbility } from "@casl/react";
import { Avatar, Dropdown, Menu } from "antd";
import React, { useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Assets } from "../../assets/svg/assets-icon.svg";
import { ReactComponent as Content } from "../../assets/svg/content-icon.svg";
import { ReactComponent as Logo } from "../../assets/svg/moira-logo.svg";
import { ReactComponent as Settings } from "../../assets/svg/settings-icon.svg";
import { MeType } from "../../graphql/queries/useMeQuery";
import { UserContext } from "../../services";
import { AbilityContext } from "../../services/Can";
import { getInitials } from "../../utils";

const userMenu = (user?: MeType, onLogout?: () => void) => (
    <Menu className="user-menu" style={{ width: "140px" }}>
        <Menu.Item key="profile">
            <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="logout" danger onClick={onLogout}>
            Logout <LogoutOutlined />
        </Menu.Item>
    </Menu>
);

const Sidebar: React.FC = () => {
    const { user, logout } = useContext(UserContext);
    const ability = useAbility(AbilityContext);
    const location = useLocation();

    const canViewSettings = useMemo(() => {
        return (
            ability.can("view", "users") ||
            ability.can("view", "roles") ||
            ability.can("view", "permissions")
        );
    }, [ability]);

    // Only use first forward slashes in the url
    const locationKey = location.pathname.split("/").slice(0, 2).join("/");

    // Get submenu pathname for parant link in navbar
    const submenuPath = location.pathname.split("/").slice(0, 3).join("/");

    const getPathname = (pathname: string) => {
        return locationKey === pathname ? submenuPath : pathname;
    };

    // Handle setting class name for links and setting selected style
    const getClassName = (pathname: string) => {
        return `menu-item ${locationKey === pathname && "menu-item-selected"}`;
    };

    return (
        <aside className="main-navbar">
            <div className="navbar-logo">
                <Link className="logo-link" to="/" title="MoiraCMS">
                    <Logo />
                </Link>
            </div>
            <div className="navbar-menu">
                <ul className="navbar">
                    <li className={getClassName("/content")}>
                        <Link to={getPathname("/content")} title="Content">
                            <span className="menu-item-icon">
                                <Content />
                            </span>
                            <span className="menu-item-title">Content</span>
                        </Link>
                    </li>
                    <li className={getClassName("/assets")}>
                        <Link to={getPathname("/assets")} title="Assets">
                            <span className="menu-item-icon">
                                <Assets />
                            </span>
                            <span className="menu-item-title">Assets</span>
                        </Link>
                    </li>
                    {canViewSettings && (
                        <li className={getClassName("/settings")}>
                            <Link to={getPathname("/settings")} title="Settings">
                                <span className="menu-item-icon">
                                    <Settings />
                                </span>
                                <span className="menu-item-title">
                                    Settings
                                </span>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
            <div className="navbar-footer">
                <Dropdown
                    overlay={userMenu(user, logout)}
                    placement="topRight"
                    trigger={["click"]}
                >
                    <button className="user-link" title="Profile">
                        <Avatar
                            style={{
                                backgroundColor: "#141c5c",
                                verticalAlign: "middle",
                            }}
                            size="large"
                            src={user?.me.avatar}
                        >
                            {user && getInitials(user?.me.name)}
                        </Avatar>
                    </button>
                </Dropdown>
            </div>
        </aside>
    );
};

export default Sidebar;
