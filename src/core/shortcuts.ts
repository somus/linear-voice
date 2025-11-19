/**
 * Keyboard Shortcuts - Simplified
 * Linear.app keyboard shortcuts and execution
 */

// ============================================================================
// TYPES
// ============================================================================

export type Shortcut = {
  id: string;
  name: string;
  description: string;
  voiceTriggers: string[];
  keys: string[];
  sequential?: boolean; // If true, keys are pressed one after another (e.g., "g" then "i")
  modifiers?: ("cmd" | "shift" | "alt" | "ctrl")[];
};

// ============================================================================
// SHORTCUT DEFINITIONS
// ============================================================================

export const SHORTCUTS: Shortcut[] = [
  // ============================================================================
  // 1. NAVIGATION SHORTCUTS
  // ============================================================================
  {
    id: "go_to_inbox",
    name: "Go to Inbox",
    description: "Navigate to inbox view",
    voiceTriggers: ["go to inbox", "open inbox", "show inbox", "inbox view"],
    keys: ["g", "i"],
    sequential: true,
  },
  {
    id: "go_to_my_issues",
    name: "Go to My Issues",
    description: "View issues assigned to me",
    voiceTriggers: ["my issues", "assigned to me", "show my tasks", "my work"],
    keys: ["g", "m"],
    sequential: true,
  },
  {
    id: "go_to_active",
    name: "Go to Active Issues",
    description: "View active issues",
    voiceTriggers: ["active issues", "current issues", "in progress"],
    keys: ["g", "a"],
    sequential: true,
  },
  {
    id: "go_to_backlog",
    name: "Go to Backlog",
    description: "Navigate to backlog view",
    voiceTriggers: ["backlog", "go to backlog", "show backlog", "backlog view"],
    keys: ["g", "b"],
    sequential: true,
  },
  {
    id: "go_to_board",
    name: "Go to Board",
    description: "Open board view",
    voiceTriggers: ["board view", "kanban", "show board", "board"],
    keys: ["g", "d"],
    sequential: true,
  },
  {
    id: "go_to_roadmap",
    name: "Go to Roadmap",
    description: "Navigate to roadmap",
    voiceTriggers: ["roadmap", "timeline", "show roadmap", "planning view"],
    keys: ["g", "r"],
    sequential: true,
  },
  {
    id: "go_to_projects",
    name: "Go to Projects",
    description: "View all projects",
    voiceTriggers: [
      "projects",
      "show projects",
      "project list",
      "all projects",
    ],
    keys: ["g", "p"],
    sequential: true,
  },
  {
    id: "go_to_archive",
    name: "Go to Archive",
    description: "View archived issues",
    voiceTriggers: ["archive", "archived issues", "show archive", "completed"],
    keys: ["g", "z"],
    sequential: true,
  },
  {
    id: "go_to_settings",
    name: "Go to Settings",
    description: "Open workspace settings",
    voiceTriggers: [
      "settings",
      "preferences",
      "configuration",
      "workspace settings",
    ],
    keys: ["g", "s"],
    sequential: true,
  },
  {
    id: "go_to_teams",
    name: "Go to Teams",
    description: "Navigate to teams view",
    voiceTriggers: ["teams", "show teams", "team list", "all teams"],
    keys: ["g", "t"],
    sequential: true,
  },
  {
    id: "go_to_cycles",
    name: "Go to Cycles",
    description: "Navigate to cycles view",
    voiceTriggers: ["cycles", "go to cycles", "show cycles", "all cycles"],
    keys: ["g", "c"],
    sequential: true,
  },
  {
    id: "go_to_active_cycle",
    name: "Go to Active Cycle",
    description: "Navigate to active cycle",
    voiceTriggers: [
      "active cycle",
      "current cycle",
      "this cycle",
      "current sprint",
    ],
    keys: ["g", "v"],
    sequential: true,
  },
  {
    id: "go_to_upcoming_cycle",
    name: "Go to Upcoming Cycle",
    description: "Navigate to upcoming cycle",
    voiceTriggers: ["upcoming cycle", "next cycle", "next sprint"],
    keys: ["g", "w"],
    sequential: true,
  },
  {
    id: "go_to_all_issues",
    name: "Go to All Issues",
    description: "View all issues",
    voiceTriggers: ["all issues", "show all issues", "every issue"],
    keys: ["g", "e"],
    sequential: true,
  },
  {
    id: "navigate_back",
    name: "Go Back",
    description: "Navigate to previous page",
    voiceTriggers: ["go back", "previous", "back", "return"],
    keys: ["["],
  },
  {
    id: "navigate_forward",
    name: "Go Forward",
    description: "Navigate to next page",
    voiceTriggers: ["go forward", "next", "forward"],
    keys: ["]"],
  },
  {
    id: "open_parent_issue",
    name: "Open Parent Issue",
    description: "Navigate to parent issue",
    voiceTriggers: ["parent issue", "go to parent", "open parent"],
    keys: ["ArrowUp"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "open_sub_issue",
    name: "Open Sub Issue",
    description: "Navigate to sub issue",
    voiceTriggers: ["sub issue", "go to sub issue", "open sub issue"],
    keys: ["ArrowDown"],
    modifiers: ["cmd", "shift"],
  },

  // ============================================================================
  // 2. QUICK OPEN SHORTCUTS
  // ============================================================================
  {
    id: "open_favorite",
    name: "Open Favorite",
    description: "Quick open a favorite",
    voiceTriggers: ["open favorite", "favorites", "bookmarks"],
    keys: ["o", "f"],
    sequential: true,
  },
  {
    id: "open_project",
    name: "Open Project",
    description: "Quick open a project",
    voiceTriggers: ["open project", "find project"],
    keys: ["o", "p"],
    sequential: true,
  },
  {
    id: "open_cycle",
    name: "Open Cycle",
    description: "Quick open a cycle",
    voiceTriggers: ["open cycle", "find cycle"],
    keys: ["o", "c"],
    sequential: true,
  },
  {
    id: "open_user",
    name: "Open User",
    description: "Quick open user profile",
    voiceTriggers: ["open user", "find user", "user profile"],
    keys: ["o", "u"],
    sequential: true,
  },
  {
    id: "open_my_profile",
    name: "Open My Profile",
    description: "Open my user profile",
    voiceTriggers: ["my profile", "open my profile", "profile"],
    keys: ["o", "m"],
    sequential: true,
  },
  {
    id: "open_team",
    name: "Open Team",
    description: "Quick open a team",
    voiceTriggers: ["open team", "find team"],
    keys: ["o", "t"],
    sequential: true,
  },

  // ============================================================================
  // 3. ISSUE ACTIONS SHORTCUTS
  // ============================================================================
  {
    id: "create_issue",
    name: "Create Issue",
    description: "Open create issue modal",
    voiceTriggers: ["new issue", "create issue", "add issue", "create new"],
    keys: ["c"],
  },
  {
    id: "create_issue_from_template",
    name: "Create from Template",
    description: "Create issue from template",
    voiceTriggers: ["new from template", "use template", "template issue"],
    keys: ["k"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "duplicate_issue",
    name: "Duplicate Issue",
    description: "Duplicate current issue",
    voiceTriggers: ["duplicate", "copy issue", "clone issue", "duplicate this"],
    keys: ["d"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "delete_issue",
    name: "Delete Issue",
    description: "Delete current issue",
    voiceTriggers: ["delete issue", "remove issue", "delete this"],
    keys: ["Delete"],
    modifiers: ["cmd"],
  },
  {
    id: "archive_issue",
    name: "Archive Issue",
    description: "Archive current issue",
    voiceTriggers: ["archive issue", "archive this", "move to archive"],
    keys: ["e"],
    modifiers: ["cmd"],
  },
  {
    id: "copy_issue_link",
    name: "Copy Issue Link",
    description: "Copy link to current issue",
    voiceTriggers: ["copy link", "get link", "share link", "copy issue link"],
    keys: ["."],
    modifiers: ["cmd"],
  },
  {
    id: "copy_issue_id",
    name: "Copy Issue ID",
    description: "Copy issue ID to clipboard",
    voiceTriggers: ["copy id", "get id", "copy issue id", "issue identifier"],
    keys: ["."],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "copy_issue_branch",
    name: "Copy Git Branch Name",
    description: "Copy git branch name for issue",
    voiceTriggers: ["copy branch", "git branch", "branch name", "get branch"],
    keys: [","],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "merge_issues",
    name: "Merge Issues",
    description: "Merge multiple issues",
    voiceTriggers: ["merge issues", "combine issues", "merge selected"],
    keys: ["m"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "create_sub_issue",
    name: "Create Sub-Issue",
    description: "Create a sub-issue",
    voiceTriggers: ["create sub issue", "new sub issue", "add sub task"],
    keys: ["o"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "move_to_team",
    name: "Move to Team",
    description: "Move issue to another team",
    voiceTriggers: ["move to team", "change team", "transfer team"],
    keys: ["m"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "set_issue_status_1",
    name: "Set Status (Quick 1)",
    description: "Quick set to first status",
    voiceTriggers: ["quick status one"],
    keys: ["1"],
    modifiers: ["cmd", "alt"],
  },
  {
    id: "set_issue_status_2",
    name: "Set Status (Quick 2)",
    description: "Quick set to second status",
    voiceTriggers: ["quick status two"],
    keys: ["2"],
    modifiers: ["cmd", "alt"],
  },
  {
    id: "set_issue_status_3",
    name: "Set Status (Quick 3)",
    description: "Quick set to third status",
    voiceTriggers: ["quick status three"],
    keys: ["3"],
    modifiers: ["cmd", "alt"],
  },
  {
    id: "archive_or_restore",
    name: "Archive/Restore Issue",
    description: "Archive or restore issue",
    voiceTriggers: ["archive or restore", "toggle archive"],
    keys: ["#"],
  },

  // ============================================================================
  // 4. ISSUE EDITING SHORTCUTS
  // ============================================================================
  {
    id: "edit_issue",
    name: "Edit Issue",
    description: "Edit issue title and description",
    voiceTriggers: ["edit issue", "modify issue", "change issue"],
    keys: ["e"],
  },
  {
    id: "rename_issue",
    name: "Rename Issue",
    description: "Quick rename issue title",
    voiceTriggers: ["rename", "change title", "rename issue", "edit title"],
    keys: ["r"],
  },
  {
    id: "assign_issue",
    name: "Assign Issue",
    description: "Open assignee selector",
    voiceTriggers: ["assign", "assign issue", "set assignee", "assign to"],
    keys: ["a"],
  },
  {
    id: "assign_to_me",
    name: "Assign to Me",
    description: "Assign issue to myself",
    voiceTriggers: ["assign to me", "take issue", "claim issue", "self assign"],
    keys: ["i"],
  },
  {
    id: "unassign_issue",
    name: "Unassign Issue",
    description: "Remove assignee from issue",
    voiceTriggers: ["unassign", "remove assignee", "unassign issue"],
    keys: ["a"],
    modifiers: ["shift"],
  },
  {
    id: "change_status",
    name: "Change Status",
    description: "Open status selector",
    voiceTriggers: ["change status", "update status", "set status", "status"],
    keys: ["s"],
  },
  {
    id: "change_priority",
    name: "Change Priority",
    description: "Set issue priority",
    voiceTriggers: ["set priority", "change priority", "priority", "urgent"],
    keys: ["p"],
    modifiers: ["shift"],
  },
  {
    id: "set_priority_urgent",
    name: "Set Priority Urgent",
    description: "Set priority to urgent",
    voiceTriggers: ["urgent priority", "make urgent", "highest priority"],
    keys: ["1"],
  },
  {
    id: "set_priority_high",
    name: "Set Priority High",
    description: "Set priority to high",
    voiceTriggers: ["high priority", "make high priority"],
    keys: ["2"],
  },
  {
    id: "set_priority_normal",
    name: "Set Priority Normal",
    description: "Set priority to normal",
    voiceTriggers: ["normal priority", "medium priority"],
    keys: ["3"],
  },
  {
    id: "set_priority_low",
    name: "Set Priority Low",
    description: "Set priority to low",
    voiceTriggers: ["low priority", "make low priority"],
    keys: ["4"],
  },
  {
    id: "clear_priority",
    name: "Clear Priority",
    description: "Remove priority from issue",
    voiceTriggers: ["no priority", "clear priority", "remove priority"],
    keys: ["0"],
  },
  {
    id: "set_labels",
    name: "Set Labels",
    description: "Open label selector",
    voiceTriggers: ["add label", "set labels", "tag issue", "labels"],
    keys: ["l"],
  },
  {
    id: "remove_label",
    name: "Remove Label",
    description: "Remove label from issue",
    voiceTriggers: ["remove label", "delete label", "clear label"],
    keys: ["l"],
    modifiers: ["shift"],
  },
  {
    id: "set_estimate",
    name: "Set Estimate",
    description: "Set issue estimate",
    voiceTriggers: ["estimate", "set estimate", "story points", "effort"],
    keys: ["e"],
    modifiers: ["shift"],
  },
  {
    id: "set_due_date",
    name: "Set Due Date",
    description: "Set issue due date",
    voiceTriggers: ["due date", "set deadline", "when due", "deadline"],
    keys: ["d"],
    modifiers: ["cmd"],
  },
  {
    id: "remove_due_date",
    name: "Remove Due Date",
    description: "Remove issue due date",
    voiceTriggers: ["remove due date", "clear deadline", "no deadline"],
    keys: ["d"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "add_to_cycle",
    name: "Add to Cycle",
    description: "Add issue to cycle/sprint",
    voiceTriggers: ["add to cycle", "add to sprint", "cycle", "sprint"],
    keys: ["c"],
    modifiers: ["shift"],
  },
  {
    id: "add_to_active_cycle",
    name: "Add to Active Cycle",
    description: "Add issue to active cycle",
    voiceTriggers: ["add to active cycle", "current cycle", "this cycle"],
    keys: ["c"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "add_to_project",
    name: "Add to Project",
    description: "Add issue to project",
    voiceTriggers: [
      "add to project",
      "move to project",
      "project",
      "assign project",
    ],
    keys: ["p"],
  },
  {
    id: "set_parent",
    name: "Set Parent Issue",
    description: "Set parent issue relationship",
    voiceTriggers: [
      "set parent",
      "make subtask",
      "parent issue",
      "link parent",
    ],
    keys: ["i"],
    modifiers: ["shift"],
  },
  {
    id: "add_comment",
    name: "Add Comment",
    description: "Start writing a comment",
    voiceTriggers: ["comment", "add comment", "write comment", "reply"],
    keys: ["m"],
    modifiers: ["cmd"],
  },

  // ============================================================================
  // 5. ISSUE RELATIONS SHORTCUTS
  // ============================================================================
  {
    id: "mark_as_blocked",
    name: "Mark as Blocked",
    description: "Mark issue as blocked by another",
    voiceTriggers: ["mark blocked", "blocked by", "is blocked"],
    keys: ["m", "b"],
    sequential: true,
  },
  {
    id: "mark_as_blocking",
    name: "Mark as Blocking",
    description: "Mark issue as blocking another",
    voiceTriggers: ["mark blocking", "blocks", "is blocking"],
    keys: ["m", "x"],
    sequential: true,
  },
  {
    id: "reference_related",
    name: "Reference Related Issue",
    description: "Reference a related issue",
    voiceTriggers: ["related issue", "reference issue", "link issue"],
    keys: ["m", "r"],
    sequential: true,
  },

  // ============================================================================
  // 6. VIEW CONTROL SHORTCUTS
  // ============================================================================
  {
    id: "toggle_sidebar",
    name: "Toggle Sidebar",
    description: "Show/hide sidebar",
    voiceTriggers: [
      "toggle sidebar",
      "hide sidebar",
      "show sidebar",
      "sidebar",
    ],
    keys: ["\\"],
    modifiers: ["cmd"],
  },
  {
    id: "toggle_details_sidebar",
    name: "Toggle Details Sidebar",
    description: "Show/hide issue details sidebar",
    voiceTriggers: ["details sidebar", "issue details", "show details"],
    keys: ["i"],
    modifiers: ["cmd"],
  },
  {
    id: "toggle_list_board_view",
    name: "Toggle List/Board View",
    description: "Switch between list and board view",
    voiceTriggers: ["toggle view", "list board", "switch layout"],
    keys: ["b"],
    modifiers: ["cmd"],
  },
  {
    id: "toggle_fullscreen",
    name: "Toggle Fullscreen",
    description: "Enter/exit fullscreen mode",
    voiceTriggers: ["fullscreen", "full screen", "maximize", "expand view"],
    keys: ["f"],
  },
  {
    id: "zoom_in",
    name: "Zoom In",
    description: "Increase zoom level",
    voiceTriggers: ["zoom in", "bigger", "increase size", "magnify"],
    keys: ["+"],
    modifiers: ["cmd"],
  },
  {
    id: "zoom_out",
    name: "Zoom Out",
    description: "Decrease zoom level",
    voiceTriggers: ["zoom out", "smaller", "decrease size", "shrink"],
    keys: ["-"],
    modifiers: ["cmd"],
  },
  {
    id: "reset_zoom",
    name: "Reset Zoom",
    description: "Reset zoom to default",
    voiceTriggers: ["reset zoom", "default size", "normal size"],
    keys: ["0"],
    modifiers: ["cmd"],
  },
  {
    id: "toggle_completed",
    name: "Toggle Completed Issues",
    description: "Show/hide completed issues",
    voiceTriggers: [
      "toggle completed",
      "show completed",
      "hide completed",
      "done issues",
    ],
    keys: ["h"],
    modifiers: ["shift"],
  },
  {
    id: "change_view",
    name: "Change View",
    description: "Switch between view types",
    voiceTriggers: ["change view", "switch view", "different view"],
    keys: ["v"],
  },
  {
    id: "group_by",
    name: "Group By",
    description: "Change grouping option",
    voiceTriggers: ["group by", "change grouping", "organize by"],
    keys: ["g"],
    modifiers: ["shift"],
  },
  {
    id: "sort_by",
    name: "Sort By",
    description: "Change sort order",
    voiceTriggers: ["sort by", "order by", "change sort"],
    keys: ["s"],
    modifiers: ["shift"],
  },
  {
    id: "toggle_filters",
    name: "Toggle Filters",
    description: "Show/hide filters panel",
    voiceTriggers: [
      "toggle filters",
      "show filters",
      "hide filters",
      "filter panel",
    ],
    keys: ["f"],
    modifiers: ["shift"],
  },

  // ============================================================================
  // 8. SEARCH AND FILTER SHORTCUTS
  // ============================================================================
  {
    id: "search",
    name: "Search",
    description: "Open search/command palette",
    voiceTriggers: ["search", "find", "look for", "search for", "command menu"],
    keys: ["k"],
    modifiers: ["cmd"],
  },
  {
    id: "open_search_slash",
    name: "Open Search (/)",
    description: "Open search with slash key",
    voiceTriggers: ["search with slash"],
    keys: ["/"],
  },
  {
    id: "save_or_submit",
    name: "Save or Submit",
    description: "Save or submit current form",
    voiceTriggers: ["save", "submit", "save changes"],
    keys: ["Enter"],
    modifiers: ["cmd"],
  },
  {
    id: "filter_issues",
    name: "Filter Issues",
    description: "Open filter menu",
    voiceTriggers: ["filter", "filter issues", "add filter", "apply filter"],
    keys: ["f"],
  },
  {
    id: "clear_filters",
    name: "Clear Filters",
    description: "Remove all filters",
    voiceTriggers: [
      "clear filters",
      "remove filters",
      "reset filters",
      "no filters",
    ],
    keys: ["x"],
    modifiers: ["shift"],
  },
  {
    id: "filter_my_issues",
    name: "Filter My Issues",
    description: "Show only my issues",
    voiceTriggers: ["only my issues", "filter mine", "just my work"],
    keys: ["m"],
    modifiers: ["shift"],
  },
  {
    id: "filter_unassigned",
    name: "Filter Unassigned",
    description: "Show unassigned issues",
    voiceTriggers: [
      "unassigned",
      "no owner",
      "not assigned",
      "available issues",
    ],
    keys: ["u"],
    modifiers: ["shift"],
  },

  // ============================================================================
  // 9. TEAM OPERATIONS SHORTCUTS
  // ============================================================================
  {
    id: "switch_team",
    name: "Switch Team",
    description: "Open team switcher",
    voiceTriggers: [
      "switch team",
      "change team",
      "different team",
      "team switcher",
    ],
    keys: ["t"],
  },
  {
    id: "team_settings",
    name: "Team Settings",
    description: "Open team settings",
    voiceTriggers: ["team settings", "team config", "team preferences"],
    keys: [","],
    modifiers: ["cmd"],
  },
  {
    id: "invite_member",
    name: "Invite Team Member",
    description: "Open invite dialog",
    voiceTriggers: [
      "invite member",
      "add member",
      "invite someone",
      "new member",
    ],
    keys: ["i"],
    modifiers: ["cmd"],
  },

  // ============================================================================
  // 7. SELECTION AND MOVEMENT SHORTCUTS
  // ============================================================================
  {
    id: "select_all",
    name: "Select All",
    description: "Select all visible issues",
    voiceTriggers: ["select all", "all issues", "select everything"],
    keys: ["a"],
    modifiers: ["cmd"],
  },
  {
    id: "select_none",
    name: "Deselect All",
    description: "Clear selection",
    voiceTriggers: ["deselect", "clear selection", "select none", "unselect"],
    keys: ["Escape"],
  },
  {
    id: "select_next",
    name: "Move Down",
    description: "Move selection down",
    voiceTriggers: ["next issue", "down", "select next", "move down"],
    keys: ["j"],
  },
  {
    id: "select_previous",
    name: "Move Up",
    description: "Move selection up",
    voiceTriggers: ["previous issue", "up", "select previous", "move up"],
    keys: ["k"],
  },
  {
    id: "move_down_arrow",
    name: "Move Down (Arrow)",
    description: "Move selection down with arrow key",
    voiceTriggers: ["arrow down"],
    keys: ["ArrowDown"],
  },
  {
    id: "move_up_arrow",
    name: "Move Up (Arrow)",
    description: "Move selection up with arrow key",
    voiceTriggers: ["arrow up"],
    keys: ["ArrowUp"],
  },
  {
    id: "move_right",
    name: "Move Right",
    description: "Move selection right",
    voiceTriggers: ["move right", "right"],
    keys: ["ArrowRight"],
  },
  {
    id: "move_left",
    name: "Move Left",
    description: "Move selection left",
    voiceTriggers: ["move left", "left"],
    keys: ["ArrowLeft"],
  },
  {
    id: "select_item",
    name: "Select Item",
    description: "Select item in list",
    voiceTriggers: ["select", "select item", "check"],
    keys: ["x"],
  },
  {
    id: "open_selected",
    name: "Open Selected",
    description: "Open selected issue",
    voiceTriggers: ["open", "open issue", "view issue", "show details"],
    keys: ["Enter"],
  },
  {
    id: "open_selected_o",
    name: "Open Selected (O)",
    description: "Open focused item with O key",
    voiceTriggers: ["open with o"],
    keys: ["o"],
  },
  {
    id: "open_in_new_tab",
    name: "Open in New Tab",
    description: "Open issue in new tab",
    voiceTriggers: ["new tab", "open in tab", "separate tab"],
    keys: ["Enter"],
    modifiers: ["cmd"],
  },
  {
    id: "peek_issue",
    name: "Peek Issue",
    description: "Peek into issue (hover and hold space)",
    voiceTriggers: ["peek", "preview", "quick view"],
    keys: [" "],
  },

  // ============================================================================
  // 10. APPLICATION SHORTCUTS
  // ============================================================================
  {
    id: "show_shortcuts",
    name: "Show Shortcuts",
    description: "Display keyboard shortcuts",
    voiceTriggers: [
      "show shortcuts",
      "help",
      "keyboard shortcuts",
      "shortcuts help",
    ],
    keys: ["?"],
  },
  {
    id: "undo",
    name: "Undo",
    description: "Undo last action",
    voiceTriggers: ["undo", "revert", "go back", "undo that"],
    keys: ["z"],
    modifiers: ["cmd"],
  },
  {
    id: "redo",
    name: "Redo",
    description: "Redo last undone action",
    voiceTriggers: ["redo", "redo that", "restore"],
    keys: ["z"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "refresh",
    name: "Refresh",
    description: "Refresh current view",
    voiceTriggers: ["refresh", "reload", "update view", "sync"],
    keys: ["r"],
    modifiers: ["cmd"],
  },
  {
    id: "toggle_dark_mode",
    name: "Toggle Dark Mode",
    description: "Switch between light/dark theme",
    voiceTriggers: ["dark mode", "light mode", "toggle theme", "switch theme"],
    keys: ["l"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "open_preferences",
    name: "Open Preferences",
    description: "Open user preferences",
    voiceTriggers: ["preferences", "settings", "my settings", "config"],
    keys: [","],
    modifiers: ["cmd"],
  },
  {
    id: "logout",
    name: "Logout",
    description: "Sign out of Linear",
    voiceTriggers: ["logout", "sign out", "log out"],
    keys: ["q"],
    modifiers: ["cmd", "shift"],
  },

  // ============================================================================
  // 11. MARKDOWN EDITOR SHORTCUTS
  // ============================================================================
  {
    id: "bold_text",
    name: "Bold",
    description: "Make text bold",
    voiceTriggers: ["bold", "make bold", "bold text"],
    keys: ["b"],
    modifiers: ["cmd"],
  },
  {
    id: "italic_text",
    name: "Italic",
    description: "Make text italic",
    voiceTriggers: ["italic", "make italic", "italicize"],
    keys: ["i"],
    modifiers: ["cmd"],
  },
  {
    id: "strikethrough_text",
    name: "Strikethrough",
    description: "Strike through text",
    voiceTriggers: ["strikethrough", "strike", "cross out"],
    keys: ["x"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "insert_link",
    name: "Insert Link",
    description: "Add hyperlink",
    voiceTriggers: ["add link", "insert link", "hyperlink"],
    keys: ["k"],
    modifiers: ["cmd"],
  },
  {
    id: "insert_code",
    name: "Insert Code",
    description: "Format as code",
    voiceTriggers: ["code", "inline code", "code format"],
    keys: ["e"],
    modifiers: ["cmd"],
  },
  {
    id: "insert_code_block",
    name: "Insert Code Block",
    description: "Add code block",
    voiceTriggers: ["code block", "multiline code", "snippet"],
    keys: ["c"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "bullet_list",
    name: "Bullet List",
    description: "Create bullet list",
    voiceTriggers: ["bullet list", "unordered list", "bullets"],
    keys: ["8"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "numbered_list",
    name: "Numbered List",
    description: "Create numbered list",
    voiceTriggers: ["numbered list", "ordered list", "numbers"],
    keys: ["9"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "underline_text",
    name: "Underline",
    description: "Underline text",
    voiceTriggers: ["underline", "underline text"],
    keys: ["u"],
    modifiers: ["cmd"],
  },
  {
    id: "blockquote",
    name: "Blockquote",
    description: "Create blockquote",
    voiceTriggers: ["blockquote", "quote", "quotation"],
    keys: [">"],
    modifiers: ["cmd"],
  },
  {
    id: "heading_1",
    name: "Heading 1",
    description: "Format as heading 1",
    voiceTriggers: ["heading one", "h1", "large heading"],
    keys: ["1"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "heading_2",
    name: "Heading 2",
    description: "Format as heading 2",
    voiceTriggers: ["heading two", "h2", "medium heading"],
    keys: ["2"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "heading_3",
    name: "Heading 3",
    description: "Format as heading 3",
    voiceTriggers: ["heading three", "h3", "small heading"],
    keys: ["3"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "todo_list",
    name: "Todo List",
    description: "Create todo/checkbox list",
    voiceTriggers: ["todo list", "checkbox list", "task list"],
    keys: ["7"],
    modifiers: ["cmd", "shift"],
  },
  {
    id: "attach_file",
    name: "Attach File",
    description: "Attach image or file",
    voiceTriggers: ["attach file", "upload file", "add attachment"],
    keys: ["a"],
    modifiers: ["cmd", "shift"],
  },
];

// ============================================================================
// KEYBOARD EVENT EXECUTION
// ============================================================================

const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);

/**
 * Execute keyboard shortcut
 */
export async function executeShortcut(shortcut: Shortcut): Promise<void> {
  if (shortcut.sequential) {
    // Sequential keys (e.g., "g" then "i")
    for (let i = 0; i < shortcut.keys.length; i++) {
      dispatchKey(shortcut.keys[i]);
      if (i < shortcut.keys.length - 1) {
        await delay(50); // Wait 50ms between keys
      }
    }
  } else {
    // Single key with modifiers (e.g., "cmd+k")
    dispatchKey(shortcut.keys[0], shortcut.modifiers);
  }
}

/**
 * Dispatch a single keyboard event
 */
function dispatchKey(key: string, modifiers: string[] = []): void {
  const target = document.activeElement || document.body;

  // Auto-detect shift for certain keys
  const requiresShift = [
    "?",
    "+",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
  ].includes(key);
  const shiftKey = modifiers.includes("shift") || requiresShift;

  const event = new KeyboardEvent("keydown", {
    key,
    code: getKeyCode(key),
    bubbles: true,
    cancelable: true,
    shiftKey,
    metaKey: modifiers.includes("cmd") && isMac,
    ctrlKey:
      modifiers.includes("ctrl") || (modifiers.includes("cmd") && !isMac),
    altKey: modifiers.includes("alt"),
  });

  target.dispatchEvent(event);

  // Also dispatch keyup
  const keyupEvent = new KeyboardEvent("keyup", {
    key,
    code: getKeyCode(key),
    bubbles: true,
    cancelable: true,
    shiftKey,
    metaKey: modifiers.includes("cmd") && isMac,
    ctrlKey:
      modifiers.includes("ctrl") || (modifiers.includes("cmd") && !isMac),
    altKey: modifiers.includes("alt"),
  });

  target.dispatchEvent(keyupEvent);
}

/**
 * Get keyboard event code from key
 */
function getKeyCode(key: string): string {
  const specialKeys: Record<string, string> = {
    Enter: "Enter",
    Escape: "Escape",
    Backspace: "Backspace",
    Delete: "Delete",
    Tab: "Tab",
    "\\": "Backslash",
    "/": "Slash",
    "[": "BracketLeft",
    "]": "BracketRight",
    ".": "Period",
    ",": "Comma",
    "?": "Slash", // Shift + /
    "+": "Equal", // Shift + =
    "-": "Minus",
    "=": "Equal",
    "0": "Digit0",
    "1": "Digit1",
    "2": "Digit2",
    "3": "Digit3",
    "4": "Digit4",
    "5": "Digit5",
    "6": "Digit6",
    "7": "Digit7",
    "8": "Digit8",
    "9": "Digit9",
  };

  if (specialKeys[key]) {
    return specialKeys[key];
  }
  if (key.length === 1 && key >= "a" && key <= "z") {
    return `Key${key.toUpperCase()}`;
  }
  if (key.length === 1 && key >= "A" && key <= "Z") {
    return `Key${key}`;
  }

  return key;
}

/**
 * Simple delay helper
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// SHORTCUT LOOKUP
// ============================================================================

/**
 * Find shortcut by ID
 */
export function findShortcutById(id: string): Shortcut | null {
  return SHORTCUTS.find((s) => s.id === id) || null;
}

/**
 * Get all shortcuts
 */
export function getAllShortcuts(): Shortcut[] {
  return SHORTCUTS;
}
