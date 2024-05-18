// src/components/UserList.tsx
import React from "react";
import "../styles/userList.scss";

interface User {
  name: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="user-list">
      <ul>
        {users.map((user) => (
          <div className="user-info">
            <br />
            <h3>{user.name}</h3>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
