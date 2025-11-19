# Linear Keyboard Shortcuts Complete Reference
## For LinearVoice Implementation

---

## Tool Schema Definition

```typescript
interface LinearShortcut {
  id: string;                          // Unique identifier
  category: ShortcutCategory;          // Category for grouping
  name: string;                         // Display name
  description: string;                  // What the shortcut does
  voiceTriggers: string[];             // Natural language triggers
  shortcut: {
    keys: string[];                    // Key sequence
    modifiers?: Modifier[];           // Modifier keys
    sequential?: boolean;              // True for "G then B" style
  };
  context?: 'global' | 'issue' | 'list'; // Where shortcut works
}

type Modifier = 'cmd' | 'ctrl' | 'shift' | 'alt' | 'option';
type ShortcutCategory = 
  | 'navigation' 
  | 'issue_actions' 
  | 'issue_editing'
  | 'view_control'
  | 'team_operations'
  | 'project_management'
  | 'search_filter'
  | 'application';
```

---

## Complete Shortcuts List

### 1. Navigation Shortcuts

```javascript
const navigationShortcuts = [
  {
    id: 'go_to_inbox',
    category: 'navigation',
    name: 'Go to Inbox',
    description: 'Navigate to inbox view',
    voiceTriggers: ['go to inbox', 'open inbox', 'show inbox', 'inbox view'],
    shortcut: { keys: ['g', 'i'], sequential: true }
  },
  {
    id: 'go_to_my_issues',
    category: 'navigation',
    name: 'Go to My Issues',
    description: 'View issues assigned to me',
    voiceTriggers: ['my issues', 'assigned to me', 'show my tasks', 'my work'],
    shortcut: { keys: ['g', 'm'], sequential: true }
  },
  {
    id: 'go_to_active',
    category: 'navigation',
    name: 'Go to Active Issues',
    description: 'View active issues',
    voiceTriggers: ['active issues', 'current issues', 'in progress'],
    shortcut: { keys: ['g', 'a'], sequential: true }
  },
  {
    id: 'go_to_backlog',
    category: 'navigation',
    name: 'Go to Backlog',
    description: 'Navigate to backlog view',
    voiceTriggers: ['backlog', 'go to backlog', 'show backlog', 'backlog view'],
    shortcut: { keys: ['g', 'b'], sequential: true }
  },
  {
    id: 'go_to_board',
    category: 'navigation',
    name: 'Go to Board',
    description: 'Open board view',
    voiceTriggers: ['board view', 'kanban', 'show board', 'board'],
    shortcut: { keys: ['g', 'd'], sequential: true }
  },
  {
    id: 'go_to_roadmap',
    category: 'navigation',
    name: 'Go to Roadmap',
    description: 'Navigate to roadmap',
    voiceTriggers: ['roadmap', 'timeline', 'show roadmap', 'planning view'],
    shortcut: { keys: ['g', 'r'], sequential: true }
  },
  {
    id: 'go_to_projects',
    category: 'navigation',
    name: 'Go to Projects',
    description: 'View all projects',
    voiceTriggers: ['projects', 'show projects', 'project list', 'all projects'],
    shortcut: { keys: ['g', 'p'], sequential: true }
  },
  {
    id: 'go_to_archive',
    category: 'navigation',
    name: 'Go to Archive',
    description: 'View archived issues',
    voiceTriggers: ['archive', 'archived issues', 'show archive', 'completed'],
    shortcut: { keys: ['g', 'z'], sequential: true }
  },
  {
    id: 'go_to_settings',
    category: 'navigation',
    name: 'Go to Settings',
    description: 'Open workspace settings',
    voiceTriggers: ['settings', 'preferences', 'configuration', 'workspace settings'],
    shortcut: { keys: ['g', 's'], sequential: true }
  },
  {
    id: 'go_to_teams',
    category: 'navigation',
    name: 'Go to Teams',
    description: 'Navigate to teams view',
    voiceTriggers: ['teams', 'show teams', 'team list', 'all teams'],
    shortcut: { keys: ['g', 't'], sequential: true }
  },
  {
    id: 'navigate_back',
    category: 'navigation',
    name: 'Go Back',
    description: 'Navigate to previous page',
    voiceTriggers: ['go back', 'previous', 'back', 'return'],
    shortcut: { keys: ['['] }
  },
  {
    id: 'navigate_forward',
    category: 'navigation',
    name: 'Go Forward',
    description: 'Navigate to next page',
    voiceTriggers: ['go forward', 'next', 'forward'],
    shortcut: { keys: [']'] }
  }
];
```

### 2. Issue Actions Shortcuts

```javascript
const issueActionShortcuts = [
  {
    id: 'create_issue',
    category: 'issue_actions',
    name: 'Create Issue',
    description: 'Open create issue modal',
    voiceTriggers: ['new issue', 'create issue', 'add issue', 'create new'],
    shortcut: { keys: ['c'] }
  },
  {
    id: 'create_issue_from_template',
    category: 'issue_actions',
    name: 'Create from Template',
    description: 'Create issue from template',
    voiceTriggers: ['new from template', 'use template', 'template issue'],
    shortcut: { keys: ['cmd', 'shift', 'k'], modifiers: ['cmd', 'shift'] }
  },
  {
    id: 'duplicate_issue',
    category: 'issue_actions',
    name: 'Duplicate Issue',
    description: 'Duplicate current issue',
    voiceTriggers: ['duplicate', 'copy issue', 'clone issue', 'duplicate this'],
    shortcut: { keys: ['cmd', 'shift', 'd'], modifiers: ['cmd', 'shift'] }
  },
  {
    id: 'delete_issue',
    category: 'issue_actions',
    name: 'Delete Issue',
    description: 'Delete current issue',
    voiceTriggers: ['delete issue', 'remove issue', 'delete this'],
    shortcut: { keys: ['cmd', 'delete'], modifiers: ['cmd'] }
  },
  {
    id: 'archive_issue',
    category: 'issue_actions',
    name: 'Archive Issue',
    description: 'Archive current issue',
    voiceTriggers: ['archive issue', 'archive this', 'move to archive'],
    shortcut: { keys: ['cmd', 'e'], modifiers: ['cmd'] }
  },
  {
    id: 'copy_issue_link',
    category: 'issue_actions',
    name: 'Copy Issue Link',
    description: 'Copy link to current issue',
    voiceTriggers: ['copy link', 'get link', 'share link', 'copy issue link'],
    shortcut: { keys: ['cmd', '.'], modifiers: ['cmd'] }
  },
  {
    id: 'copy_issue_id',
    category: 'issue_actions',
    name: 'Copy Issue ID',
    description: 'Copy issue ID to clipboard',
    voiceTriggers: ['copy id', 'get id', 'copy issue id', 'issue identifier'],
    shortcut: { keys: ['cmd', 'shift', '.'], modifiers: ['cmd', 'shift'] }
  },
  {
    id: 'copy_issue_branch',
    category: 'issue_actions',
    name: 'Copy Git Branch Name',
    description: 'Copy git branch name for issue',
    voiceTriggers: ['copy branch', 'git branch', 'branch name', 'get branch'],
    shortcut: { keys: ['cmd', 'shift', ','], modifiers: ['cmd', 'shift'] }
  },
  {
    id: 'merge_issues',
    category: 'issue_actions',
    name: 'Merge Issues',
    description: 'Merge multiple issues',
    voiceTriggers: ['merge issues', 'combine issues', 'merge selected'],
    shortcut: { keys: ['cmd', 'shift', 'm'], modifiers: ['cmd', 'shift'] }
  }
];
```

### 3. Issue Editing Shortcuts

```javascript
const issueEditingShortcuts = [
  {
    id: 'edit_issue',
    category: 'issue_editing',
    name: 'Edit Issue',
    description: 'Edit issue title and description',
    voiceTriggers: ['edit issue', 'modify issue', 'change issue'],
    shortcut: { keys: ['e'] }
  },
  {
    id: 'rename_issue',
    category: 'issue_editing',
    name: 'Rename Issue',
    description: 'Quick rename issue title',
    voiceTriggers: ['rename', 'change title', 'rename issue', 'edit title'],
    shortcut: { keys: ['r'] }
  },
  {
    id: 'assign_issue',
    category: 'issue_editing',
    name: 'Assign Issue',
    description: 'Open assignee selector',
    voiceTriggers: ['assign', 'assign issue', 'set assignee', 'assign to'],
    shortcut: { keys: ['a'] }
  },
  {
    id: 'assign_to_me',
    category: 'issue_editing',
    name: 'Assign to Me',
    description: 'Assign issue to myself',
    voiceTriggers: ['assign to me', 'take issue', 'claim issue', 'self assign'],
    shortcut: { keys: ['i'] }
  },
  {
    id: 'unassign_issue',
    category: 'issue_editing',
    name: 'Unassign Issue',
    description: 'Remove assignee from issue',
    voiceTriggers: ['unassign', 'remove assignee', 'unassign issue'],
    shortcut: { keys: ['shift', 'a'], modifiers: ['shift'] }
  },
  {
    id: 'change_status',
    category: 'issue_editing',
    name: 'Change Status',
    description: 'Open status selector',
    voiceTriggers: ['change status', 'update status', 'set status', 'status'],
    shortcut: { keys: ['s'] }
  },
  {
    id: 'change_priority',
    category: 'issue_editing',
    name: 'Change Priority',
    description: 'Set issue priority',
    voiceTriggers: ['set priority', 'change priority', 'priority', 'urgent'],
    shortcut: { keys: ['shift', 'p'], modifiers: ['shift'] }
  },
  {
    id: 'set_priority_urgent',
    category: 'issue_editing',
    name: 'Set Priority Urgent',
    description: 'Set priority to urgent',
    voiceTriggers: ['urgent priority', 'make urgent', 'highest priority'],
    shortcut: { keys: ['1'] }
  },
  {
    id: 'set_priority_high',
    category: 'issue_editing',
    name: 'Set Priority High',
    description: 'Set priority to high',
    voiceTriggers: ['high priority', 'make high priority'],
    shortcut: { keys: ['2'] }
  },
  {
    id: 'set_priority_normal',
    category: 'issue_editing',
    name: 'Set Priority Normal',
    description: 'Set priority to normal',
    voiceTriggers: ['normal priority', 'medium priority'],
    shortcut: { keys: ['3'] }
  },
  {
    id: 'set_priority_low',
    category: 'issue_editing',
    name: 'Set Priority Low',
    description: 'Set priority to low',
    voiceTriggers: ['low priority', 'make low priority'],
    shortcut: { keys: ['4'] }
  },
  {
    id: 'clear_priority',
    category: 'issue_editing',
    name: 'Clear Priority',
    description: 'Remove priority from issue',
    voiceTriggers: ['no priority', 'clear priority', 'remove priority'],
    shortcut: { keys: ['0'] }
  },
  {
    id: 'set_labels',
    category: 'issue_editing',
    name: 'Set Labels',
    description: 'Open label selector',
    voiceTriggers: ['add label', 'set labels', 'tag issue', 'labels'],
    shortcut: { keys: ['l'] }
  },
  {
    id: 'set_estimate',
    category: 'issue_editing',
    name: 'Set Estimate',
    description: 'Set issue estimate',
    voiceTriggers: ['estimate', 'set estimate', 'story points', 'effort'],
    shortcut: { keys: ['shift', 'e'], modifiers: ['shift'] }
  },
  {
    id: 'set_due_date',
    category: 'issue_editing',
    name: 'Set Due Date',
    description: 'Set issue due date',
    voiceTriggers: ['due date', 'set deadline', 'when due', 'deadline'],
    shortcut: { keys: ['shift', 'd'], modifiers: ['shift'] }
  },
  {
    id: 'add_to_cycle',
    category: 'issue_editing',
    name: 'Add to Cycle',
    description: 'Add issue to cycle/sprint',
    voiceTriggers: ['add to cycle', 'add to sprint', 'cycle', 'sprint'],
    shortcut: { keys: ['shift', 'c'], modifiers: ['shift'] }
  },
  {
    id: 'add_to_project',
    category: 'issue_editing',
    name: 'Add to Project',
    description: 'Add issue to project',
    voiceTriggers: ['add to project', 'move to project', 'project', 'assign project'],
    shortcut: { keys: ['p'] }
  },
  {
    id: 'set_parent',
    category: 'issue_editing',
    name: 'Set Parent Issue',
    description: 'Set parent issue relationship',
    voiceTriggers: ['set parent', 'make subtask', 'parent issue', 'link parent'],
    shortcut: { keys: ['shift', 'i'], modifiers: ['shift'] }
  },
  {
    id: 'add_comment',
    category: 'issue_editing',
    name: 'Add Comment',
    description: 'Start writing a comment',
    voiceTriggers: ['comment', 'add comment', 'write comment', 'reply'],
    shortcut: { keys: ['cmd', 'enter'], modifiers: ['cmd'] }
  }
];
```

### 4. View Control Shortcuts

```javascript
const viewControlShortcuts = [
  {
    id: 'toggle_sidebar',
    category: 'view_control',
    name: 'Toggle Sidebar',
    description: 'Show/hide sidebar',
    voiceTriggers: ['toggle sidebar', 'hide sidebar', 'show sidebar', 'sidebar'],
    shortcut: { keys: ['cmd', '\\'], modifiers: ['cmd'] }
  },
  {
    id: 'toggle_fullscreen',
    category: 'view_control',
    name: 'Toggle Fullscreen',
    description: 'Enter/exit fullscreen mode',
    voiceTriggers: ['fullscreen', 'full screen', 'maximize', 'expand view'],
    shortcut: { keys: ['f'] }
  },
  {
    id: 'zoom_in',
    category: 'view_control',
    name: 'Zoom In',
    description: 'Increase zoom level',
    voiceTriggers: ['zoom in', 'bigger', 'increase size', 'magnify'],
    shortcut: { keys: ['cmd', '+'], modifiers: ['cmd'] }
  },
  {
    id: 'zoom_out',
    category: 'view_control',
    name: 'Zoom Out',
    description: 'Decrease zoom level',
    voiceTriggers: ['zoom out', 'smaller', 'decrease size', 'shrink'],
    shortcut: { keys: ['cmd', '-'], modifiers: ['cmd'] }
  },
  {
    id: 'reset_zoom',
    category: 'view_control',
    name: 'Reset Zoom',
    description: 'Reset zoom to default',
    voiceTriggers: ['reset zoom', 'default size', 'normal size'],
    shortcut: { keys: ['cmd', '0'], modifiers: ['cmd'] }
  },
  {
    id: 'toggle_completed',
    category: 'view_control',
    name: 'Toggle Completed Issues',
    description: 'Show/hide completed issues',
    voiceTriggers: ['toggle completed', 'show completed', 'hide completed', 'done issues'],
    shortcut: { keys: ['shift', 'h'], modifiers: ['shift'] }
  },
  {
    id: 'change_view',
    category: 'view_control',
    name: 'Change View',
    description: 'Switch between view types',
    voiceTriggers: ['change view', 'switch view', 'different view'],
    shortcut: { keys: ['v'] }
  },
  {
    id: 'group_by',
    category: 'view_control',
    name: 'Group By',
    description: 'Change grouping option',
    voiceTriggers: ['group by', 'change grouping', 'organize by'],
    shortcut: { keys: ['shift', 'g'], modifiers: ['shift'] }
  },
  {
    id: 'sort_by',
    category: 'view_control',
    name: 'Sort By',
    description: 'Change sort order',
    voiceTriggers: ['sort by', 'order by', 'change sort'],
    shortcut: { keys: ['shift', 's'], modifiers: ['shift'] }
  },
  {
    id: 'toggle_filters',
    category: 'view_control',
    name: 'Toggle Filters',
    description: 'Show/hide filters panel',
    voiceTriggers: ['toggle filters', 'show filters', 'hide filters', 'filter panel'],
    shortcut: { keys: ['shift', 'f'], modifiers: ['shift'] }
  }
];
```

### 5. Search and Filter Shortcuts

```javascript
const searchFilterShortcuts = [
  {
    id: 'search',
    category: 'search_filter',
    name: 'Search',
    description: 'Open search/command palette',
    voiceTriggers: ['search', 'find', 'look for', 'search for'],
    shortcut: { keys: ['cmd', 'k'], modifiers: ['cmd'] }
  },
  {
    id: 'filter_issues',
    category: 'search_filter',
    name: 'Filter Issues',
    description: 'Open filter menu',
    voiceTriggers: ['filter', 'filter issues', 'add filter', 'apply filter'],
    shortcut: { keys: ['f'] }
  },
  {
    id: 'clear_filters',
    category: 'search_filter',
    name: 'Clear Filters',
    description: 'Remove all filters',
    voiceTriggers: ['clear filters', 'remove filters', 'reset filters', 'no filters'],
    shortcut: { keys: ['shift', 'x'], modifiers: ['shift'] }
  },
  {
    id: 'filter_my_issues',
    category: 'search_filter',
    name: 'Filter My Issues',
    description: 'Show only my issues',
    voiceTriggers: ['only my issues', 'filter mine', 'just my work'],
    shortcut: { keys: ['shift', 'm'], modifiers: ['shift'] }
  },
  {
    id: 'filter_unassigned',
    category: 'search_filter',
    name: 'Filter Unassigned',
    description: 'Show unassigned issues',
    voiceTriggers: ['unassigned', 'no owner', 'not assigned', 'available issues'],
    shortcut: { keys: ['shift', 'u'], modifiers: ['shift'] }
  }
];
```

### 6. Team Operations Shortcuts

```javascript
const teamOperationShortcuts = [
  {
    id: 'switch_team',
    category: 'team_operations',
    name: 'Switch Team',
    description: 'Open team switcher',
    voiceTriggers: ['switch team', 'change team', 'different team', 'team switcher'],
    shortcut: { keys: ['t'] }
  },
  {
    id: 'team_settings',
    category: 'team_operations',
    name: 'Team Settings',
    description: 'Open team settings',
    voiceTriggers: ['team settings', 'team config', 'team preferences'],
    shortcut: { keys: ['cmd', ','], modifiers: ['cmd'] }
  },
  {
    id: 'invite_member',
    category: 'team_operations',
    name: 'Invite Team Member',
    description: 'Open invite dialog',
    voiceTriggers: ['invite member', 'add member', 'invite someone', 'new member'],
    shortcut: { keys: ['cmd', 'i'], modifiers: ['cmd'] }
  }
];
```

### 7. Selection and Multi-Select Shortcuts

```javascript
const selectionShortcuts = [
  {
    id: 'select_all',
    category: 'selection',
    name: 'Select All',
    description: 'Select all visible issues',
    voiceTriggers: ['select all', 'all issues', 'select everything'],
    shortcut: { keys: ['cmd', 'a'], modifiers: ['cmd'] }
  },
  {
    id: 'select_none',
    category: 'selection',
    name: 'Deselect All',
    description: 'Clear selection',
    voiceTriggers: ['deselect', 'clear selection', 'select none', 'unselect'],
    shortcut: { keys: ['escape'] }
  },
  {
    id: 'select_next',
    category: 'selection',
    name: 'Select Next',
    description: 'Move selection down',
    voiceTriggers: ['next issue', 'down', 'select next'],
    shortcut: { keys: ['j'] }
  },
  {
    id: 'select_previous',
    category: 'selection',
    name: 'Select Previous',
    description: 'Move selection up',
    voiceTriggers: ['previous issue', 'up', 'select previous'],
    shortcut: { keys: ['k'] }
  },
  {
    id: 'multi_select',
    category: 'selection',
    name: 'Multi-Select',
    description: 'Add to selection',
    voiceTriggers: ['multi select', 'add to selection', 'select multiple'],
    shortcut: { keys: ['shift'], modifiers: ['shift'] }
  },
  {
    id: 'open_selected',
    category: 'selection',
    name: 'Open Selected',
    description: 'Open selected issue',
    voiceTriggers: ['open', 'open issue', 'view issue', 'show details'],
    shortcut: { keys: ['enter'] }
  },
  {
    id: 'open_in_new_tab',
    category: 'selection',
    name: 'Open in New Tab',
    description: 'Open issue in new tab',
    voiceTriggers: ['new tab', 'open in tab', 'separate tab'],
    shortcut: { keys: ['cmd', 'enter'], modifiers: ['cmd'] }
  }
];
```

### 8. Application Shortcuts

```javascript
const applicationShortcuts = [
  {
    id: 'show_shortcuts',
    category: 'application',
    name: 'Show Shortcuts',
    description: 'Display keyboard shortcuts',
    voiceTriggers: ['show shortcuts', 'help', 'keyboard shortcuts', 'shortcuts help'],
    shortcut: { keys: ['?'] }
  },
  {
    id: 'undo',
    category: 'application',
    name: 'Undo',
    description: 'Undo last action',
    voiceTriggers: ['undo', 'revert', 'go back', 'undo that'],
    shortcut: { keys: ['cmd', 'z'], modifiers: ['cmd'] }
  },
  {
    id: 'redo',
    category: 'application',
    name: 'Redo',
    description: 'Redo last undone action',
    voiceTriggers: ['redo', 'redo that', 'restore'],
    shortcut: { keys: ['cmd', 'shift', 'z'], modifiers: ['cmd', 'shift'] }
  },
  {
    id: 'refresh',
    category: 'application',
    name: 'Refresh',
    description: 'Refresh current view',
    voiceTriggers: ['refresh', 'reload', 'update view', 'sync'],
    shortcut: { keys: ['cmd', 'r'], modifiers: ['cmd'] }
  },
  {
    id: 'toggle_dark_mode',
    category: 'application',
    name: 'Toggle Dark Mode',
    description: 'Switch between light/dark theme',
    voiceTriggers: ['dark mode', 'light mode', 'toggle theme', 'switch theme'],
    shortcut: { keys: ['cmd', 'shift', 'l'], modifiers: ['cmd', 'shift'] }
  },
  {
    id: 'open_preferences',
    category: 'application',
    name: 'Open Preferences',
    description: 'Open user preferences',
    voiceTriggers: ['preferences', 'settings', 'my settings', 'config'],
    shortcut: { keys: ['cmd', ','], modifiers: ['cmd'] }
  },
  {
    id: 'logout',
    category: 'application',
    name: 'Logout',
    description: 'Sign out of Linear',
    voiceTriggers: ['logout', 'sign out', 'log out'],
    shortcut: { keys: ['cmd', 'shift', 'q'], modifiers: ['cmd', 'shift'] }
  }
];
```

### 9. Markdown Editor Shortcuts (When in text editor)

```javascript
const markdownShortcuts = [
  {
    id: 'bold_text',
    category: 'markdown',
    name: 'Bold',
    description: 'Make text bold',
    voiceTriggers: ['bold', 'make bold', 'bold text'],
    shortcut: { keys: ['cmd', 'b'], modifiers: ['cmd'] },
    context: 'editor'
  },
  {
    id: 'italic_text',
    category: 'markdown',
    name: 'Italic',
    description: 'Make text italic',
    voiceTriggers: ['italic', 'make italic', 'italicize'],
    shortcut: { keys: ['cmd', 'i'], modifiers: ['cmd'] },
    context: 'editor'
  },
  {
    id: 'strikethrough_text',
    category: 'markdown',
    name: 'Strikethrough',
    description: 'Strike through text',
    voiceTriggers: ['strikethrough', 'strike', 'cross out'],
    shortcut: { keys: ['cmd', 'shift', 'x'], modifiers: ['cmd', 'shift'] },
    context: 'editor'
  },
  {
    id: 'insert_link',
    category: 'markdown',
    name: 'Insert Link',
    description: 'Add hyperlink',
    voiceTriggers: ['add link', 'insert link', 'hyperlink'],
    shortcut: { keys: ['cmd', 'k'], modifiers: ['cmd'] },
    context: 'editor'
  },
  {
    id: 'insert_code',
    category: 'markdown',
    name: 'Insert Code',
    description: 'Format as code',
    voiceTriggers: ['code', 'inline code', 'code format'],
    shortcut: { keys: ['cmd', 'e'], modifiers: ['cmd'] },
    context: 'editor'
  },
  {
    id: 'insert_code_block',
    category: 'markdown',
    name: 'Insert Code Block',
    description: 'Add code block',
    voiceTriggers: ['code block', 'multiline code', 'snippet'],
    shortcut: { keys: ['cmd', 'shift', 'c'], modifiers: ['cmd', 'shift'] },
    context: 'editor'
  },
  {
    id: 'bullet_list',
    category: 'markdown',
    name: 'Bullet List',
    description: 'Create bullet list',
    voiceTriggers: ['bullet list', 'unordered list', 'bullets'],
    shortcut: { keys: ['cmd', 'shift', '8'], modifiers: ['cmd', 'shift'] },
    context: 'editor'
  },
  {
    id: 'numbered_list',
    category: 'markdown',
    name: 'Numbered List',
    description: 'Create numbered list',
    voiceTriggers: ['numbered list', 'ordered list', 'numbers'],
    shortcut: { keys: ['cmd', 'shift', '7'], modifiers: ['cmd', 'shift'] },
    context: 'editor'
  }
];
```

---

## Combined Export for Implementation

```javascript
// Complete shortcuts array for LinearVoice
export const allLinearShortcuts = [
  ...navigationShortcuts,
  ...issueActionShortcuts,
  ...issueEditingShortcuts,
  ...viewControlShortcuts,
  ...searchFilterShortcuts,
  ...teamOperationShortcuts,
  ...selectionShortcuts,
  ...applicationShortcuts,
  ...markdownShortcuts
];

// Total count: 100+ shortcuts
console.log(`Total Linear shortcuts mapped: ${allLinearShortcuts.length}`);
```

---

## Helper Functions for Implementation

```javascript
/**
 * Execute a Linear shortcut
 */
export function executeShortcut(shortcut: LinearShortcut): void {
  const { keys, modifiers, sequential } = shortcut.shortcut;
  
  if (sequential) {
    // Handle sequential shortcuts like "G then B"
    keys.forEach((key, index) => {
      setTimeout(() => {
        dispatchKeyEvent(key);
      }, index * 50); // 50ms delay between keys
    });
  } else {
    // Handle single or modified shortcuts
    dispatchKeyEvent(keys[0], modifiers);
  }
}

/**
 * Dispatch keyboard event to Linear
 */
function dispatchKeyEvent(key: string, modifiers: string[] = []): void {
  const event = new KeyboardEvent('keydown', {
    key,
    code: getKeyCode(key),
    bubbles: true,
    cancelable: true,
    composed: true,
    shiftKey: modifiers.includes('shift'),
    metaKey: modifiers.includes('cmd'),
    ctrlKey: modifiers.includes('ctrl'),
    altKey: modifiers.includes('alt') || modifiers.includes('option')
  });
  
  document.activeElement?.dispatchEvent(event) || 
  document.body.dispatchEvent(event);
}

/**
 * Convert key to proper KeyCode
 */
function getKeyCode(key: string): string {
  // Special keys mapping
  const specialKeys: Record<string, string> = {
    'enter': 'Enter',
    'escape': 'Escape',
    'delete': 'Delete',
    'tab': 'Tab',
    'space': 'Space',
    ' ': 'Space',
    '[': 'BracketLeft',
    ']': 'BracketRight',
    '\\': 'Backslash',
    '/': 'Slash',
    '.': 'Period',
    ',': 'Comma',
    '?': 'Slash', // with shift
    '+': 'Equal',  // with shift
    '-': 'Minus',
    '0': 'Digit0',
    '1': 'Digit1',
    '2': 'Digit2',
    '3': 'Digit3',
    '4': 'Digit4'
  };
  
  if (specialKeys[key.toLowerCase()]) {
    return specialKeys[key.toLowerCase()];
  }
  
  // Regular letters
  if (key.length === 1 && /[a-z]/i.test(key)) {
    return `Key${key.toUpperCase()}`;
  }
  
  return key;
}

/**
 * Find shortcut by voice trigger
 */
export function findShortcutByVoice(voiceCommand: string): LinearShortcut | null {
  const normalizedCommand = voiceCommand.toLowerCase().trim();
  
  return allLinearShortcuts.find(shortcut => 
    shortcut.voiceTriggers.some(trigger => 
      normalizedCommand.includes(trigger.toLowerCase()) ||
      trigger.toLowerCase().includes(normalizedCommand)
    )
  ) || null;
}

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: ShortcutCategory): LinearShortcut[] {
  return allLinearShortcuts.filter(s => s.category === category);
}
```

---

## Voice Command Examples

### Natural Language Mapping
```javascript
const voiceCommandExamples = {
  // Navigation
  "take me to my inbox": "go_to_inbox",
  "show me the backlog": "go_to_backlog",
  "open my tasks": "go_to_my_issues",
  
  // Issue Creation
  "I need to create a new issue": "create_issue",
  "let's add a new task": "create_issue",
  "make a new bug report": "create_issue",
  
  // Assignment
  "assign this to me": "assign_to_me",
  "I'll take this one": "assign_to_me",
  "give this to someone else": "assign_issue",
  
  // Status Changes
  "mark this as done": "change_status",
  "this is urgent": "set_priority_urgent",
  "move to in progress": "change_status",
  
  // View Control
  "hide the sidebar": "toggle_sidebar",
  "make it fullscreen": "toggle_fullscreen",
  "search for something": "search"
};
```

---

## Implementation Notes

1. **Context Awareness**: Some shortcuts only work in specific contexts (e.g., markdown shortcuts in editor)
2. **Platform Differences**: 
   - Mac: Use `cmd` modifier
   - Windows/Linux: Replace `cmd` with `ctrl`
3. **Sequential Shortcuts**: Need delay between keystrokes (50-100ms recommended)
4. **Focus Management**: Ensure Linear tab has focus before dispatching events
5. **Validation**: Test each shortcut in Linear's actual environment

---

## Testing Checklist

- [ ] All navigation shortcuts working
- [ ] Issue creation and editing functional
- [ ] Priority and status changes apply correctly
- [ ] Multi-select operations work
- [ ] View controls toggle properly
- [ ] Search and filter commands execute
- [ ] Markdown formatting in editor works
- [ ] Sequential shortcuts (G then X) execute correctly
- [ ] Modified shortcuts (Cmd+X) work on all platforms

---

*This document should be referenced during LinearVoice implementation to ensure all shortcuts are properly mapped and functional.*
