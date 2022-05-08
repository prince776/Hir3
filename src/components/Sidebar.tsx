import { useNavigate } from "react-router-dom";

interface SidebarProps {
    chatUsers: string[];
    activeName?: string;
};

const Sidebar = (props: SidebarProps) => {
    const navigate = useNavigate();

    return (
        <div className="nav row">
            <div className="p-2 h4 border-bottom" >Your chats</div>
            {
                props.chatUsers.length > 0 ?
                props.chatUsers.map(chatUser => {
                    return (
                        <div key={chatUser} role="button" className={`border nav-item nav-link ${chatUser===props.activeName? 'active': ''}`} onClick={() => navigate(`/chat?user=${chatUser}`)}>{chatUser}</div>
                    )
                })
                :
                  <div className="p-2 h5 border-bottom">No chats yet</div>

            }
        </div>
    );
}

export default Sidebar;