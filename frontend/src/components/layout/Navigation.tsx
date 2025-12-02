// React Imports
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// MUI Imports
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Hook Imports
import { useNavigation } from '../../hooks/useNavigation';

// Config Imports
import { navigationItems as menuItems, navigationConfig } from '../../config/navigation';

const { navWidth: drawerWidth, collapsedWidth } = navigationConfig;

// Icon mapping
const iconMap: { [key: string]: React.ReactNode } = {
  Dashboard: <i className="ri-dashboard-line" />,
  Home: <i className="ri-home-line" />,
  Info: <i className="ri-information-line" />,
  Calculate: <i className="ri-calculator-line" />,
  Palette: <i className="ri-palette-line" />,
  Login: <i className="ri-login-box-line" />,
  PersonAdd: <i className="ri-user-add-line" />,
  Settings: <i className="ri-settings-3-line" />,
  People: <i className="ri-team-line" />,
  Organization: <i className="ri-building-line" />,
  Calendar: <i className="ri-calendar-line" />,
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    transition: theme.transitions.create(['width', 'box-shadow'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('lg')]: {
      position: 'fixed'
    }
  }
}));

interface NavigationProps {
  open?: boolean;
  onClose?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ open = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    isCollapsed,
    isHovered,
    isBreakpointReached,
    isPinned,
    // toggleCollapse,
    togglePin,
    handleMouseEnter,
    handleMouseLeave
  } = useNavigation();

  // Track which menu items are expanded
  // Auto-expand items if current path matches any child
  const getInitialExpandedState = () => {
    const state: { [key: string]: boolean } = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          (child) => child.path && location.pathname === child.path
        );
        if (hasActiveChild) {
          state[item.title] = true;
        }
      }
    });
    return state;
  };

  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>(getInitialExpandedState());

  const handleNavigation = (path: string) => {
    if (path) {
      navigate(path);
      // Close mobile drawer on navigation
      if (isBreakpointReached && onClose) {
        onClose();
      }
    }
  };

  const handleMenuClick = (item: any) => {
    if (item.children && item.children.length > 0) {
      // Toggle expansion for items with children
      setExpandedItems(prev => ({
        ...prev,
        [item.title]: !prev[item.title]
      }));
      
      // If not expanded and has a path, navigate to first child or parent path
      if (!expandedItems[item.title]) {
        if (item.path) {
          handleNavigation(item.path);
        } else if (item.children[0]?.path) {
          handleNavigation(item.children[0].path);
        }
      }
    } else if (item.path) {
      // Navigate directly if no children
      handleNavigation(item.path);
    }
  };

  const isItemActive = (item: any): boolean => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    if (item.children) {
      return item.children.some((child: any) => 
        child.path && location.pathname === child.path
      );
    }
    return false;
  };

  const effectiveWidth = isCollapsed && !isHovered ? collapsedWidth : drawerWidth;

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        minHeight: 64
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 600,
            opacity: isCollapsed && !isHovered ? 0 : 1,
            transition: theme => theme.transitions.create('opacity', {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut
            })
          }}
        >
          React Dashboard
        </Typography>
        {!isBreakpointReached && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={togglePin} sx={{ color: isPinned ? 'primary.main' : 'text.secondary' }}>
              {isPinned ? (
                <i className="ri-radio-button-line text-xl" />
              ) : (
                <i className="ri-checkbox-blank-circle-line text-xl" />
              )}
            </IconButton>
            {/* <IconButton onClick={toggleCollapse}>
              {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton> */}
          </Box>
        )}
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List component="nav" sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.title] || false;
            const isActive = isItemActive(item);

            return (
              <React.Fragment key={item.title}>
                <ListItem disablePadding sx={{ mb: hasChildren ? 0 : 1 }}>
                  <ListItemButton
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: 1,
                      minHeight: 48,
                      justifyContent: isCollapsed && !isHovered ? 'center' : 'flex-start',
                      transition: theme.transitions.create(['background-color', 'color', 'transform'], {
                        duration: theme.transitions.duration.standard,
                        easing: theme.transitions.easing.easeInOut
                      }),
                      '&.active': {
                        backgroundColor: theme.palette.primary.main + '14',
                        '& .MuiListItemIcon-root, & .MuiTypography-root': {
                          color: 'primary.main'
                        }
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        borderRadius: 1
                      }
                    }}
                    className={isActive ? 'active' : ''}
                    onClick={() => handleMenuClick(item)}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: isCollapsed && !isHovered ? 0 : 40,
                        mr: isCollapsed && !isHovered ? 0 : 2,
                        justifyContent: 'center',
                        color: isActive ? 'primary.main' : 'text.secondary',
                        fontSize: '22px',
                        transition: theme => theme.transitions.create('color', {
                          duration: theme.transitions.duration.standard,
                          easing: theme.transitions.easing.easeInOut
                        })
                      }}
                    >
                      {item.icon && iconMap[item.icon]}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        opacity: isCollapsed && !isHovered ? 0 : 1,
                        transition: theme => theme.transitions.create('opacity', {
                          duration: theme.transitions.duration.standard,
                          easing: theme.transitions.easing.easeInOut
                        })
                      }}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'primary.main' : 'text.secondary'
                      }}
                    />
                    {hasChildren && !isCollapsed && !isHovered && (
                      isExpanded ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                {hasChildren && (
                  <Collapse in={isExpanded || isCollapsed || isHovered} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children?.map((child) => {
                        const isChildActive = child.path && location.pathname === child.path;
                        return (
                          <ListItem key={child.title} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                              sx={{
                                py: 1,
                                px: 2,
                                pl: 4,
                                borderRadius: 1,
                                minHeight: 40,
                                '&.active': {
                                  backgroundColor: theme.palette.primary.main + '14',
                                  '& .MuiTypography-root': {
                                    color: 'primary.main',
                                    fontWeight: 600
                                  }
                                },
                                '&:hover': {
                                  backgroundColor: theme.palette.action.hover,
                                }
                              }}
                              className={isChildActive ? 'active' : ''}
                              onClick={() => handleNavigation(child.path || '')}
                            >
                              <ListItemText
                                primary={child.title}
                                primaryTypographyProps={{
                                  noWrap: true,
                                  fontSize: '0.8rem',
                                  fontWeight: isChildActive ? 600 : 400,
                                  color: isChildActive ? 'primary.main' : 'text.secondary'
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: 0,
        [theme.breakpoints.up('lg')]: {
          width: effectiveWidth,
          transition: theme.transitions.create('width')
        }
      }}
    >
      {/* Mobile navigation drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: 'background.paper',
            boxShadow: theme.shadows[8]
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop navigation drawer */}
      <StyledDrawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: effectiveWidth,
            transform: 'none',
            visibility: 'visible'
          }
        }}
      >
        {drawer}
      </StyledDrawer>
    </Box>
  );
};
