import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { FaDumbbell, FaUser } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { MdDashboard } from 'react-icons/md';
import styled from '@emotion/styled';

const StyledNavbar = styled(Navbar)`
  background: linear-gradient(135deg, #4A90E2 0%, #5C6BC0 100%);
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BrandLink = styled(Link)`
  color: white !important;
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #E3F2FD !important;
  }
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: white !important;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserDropdown = styled(NavDropdown)`
  .dropdown-toggle {
    color: white !important;
    font-weight: 500;
  }

  .dropdown-menu {
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .dropdown-item {
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background-color: #E3F2FD;
    }
  }
`;

const LoginButton = styled(Button)`
  background-color: transparent;
  border: 2px solid white;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: white;
    color: #4A90E2;
    border-color: white;
  }
`;

const RegisterButton = styled(Button)`
  background-color: white;
  border: 2px solid white;
  color: #4A90E2;
  font-weight: 500;
  padding: 0.5rem 1.5rem;
  margin-left: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: #E3F2FD;
    color: #4A90E2;
    border-color: #E3F2FD;
  }
`;

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/pages/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StyledNavbar expand="lg" variant="dark">
      <Container>
        <BrandLink to={userInfo ? "/pages/home" : "/"}>
          <FaDumbbell /> Health & Fitness
        </BrandLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {userInfo ? (
              <>
                <NavLink to="/pages/dashboard" className="nav-link">
                  <MdDashboard className="me-1" /> Dashboard
                </NavLink>
                <NavLink to="/pages/workouts" className="nav-link">
                  Workouts
                </NavLink>
                <NavLink to="/pages/nutrition-checker" className="nav-link">
                  Nutrition
                </NavLink>
                <NavLink to="/pages/meal-plan" className="nav-link">
                  Meal Plan
                </NavLink>
                <NavLink to="/pages/diet-profile" className="nav-link">
                  <GiMuscleUp className="me-1" /> Diet Profile
                </NavLink>
                <NavLink to="/pages/bmr-calculator" className="nav-link">
                  BMR Calculator
                </NavLink>
                <NavLink to="/pages/medications" className="nav-link">
                  Medications
                </NavLink>
                <NavLink to="/pages/about" className="nav-link">
                  About
                </NavLink>
                <UserDropdown 
                  title={<><FaUser className="me-1" /> {userInfo.name}</>} 
                  id="username"
                >
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </UserDropdown>
              </>
            ) : (
              <>
                <NavLink to="/pages/about" className="nav-link">
                  About
                </NavLink>
                <LoginButton as={Link} to="/pages/login">
                  Sign In
                </LoginButton>
                <RegisterButton as={Link} to="/pages/register">
                  Register
                </RegisterButton>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;
