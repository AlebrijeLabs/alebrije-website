// ALBJ Telegram Groups and Channels Configuration
module.exports = {
  // ===================
  // GROUP/CHANNEL IDS
  // ===================
  
  // Main ALBJ groups and channels
  MAIN_GROUPS: [
    // Add your main group/channel IDs here
    // Examples:
    // '@ALBJTokenChannel',           // Public channel with @username
    // '-1001234567890',             // Private group with numeric ID
    // '-1009876543210',             // Private channel with numeric ID
  ],
  
  // Regional or language-specific groups
  REGIONAL_GROUPS: [
    // Add regional group IDs here
    // Examples:
    // '-1001111111111',             // ALBJ Spanish
    // '-1002222222222',             // ALBJ Portuguese  
    // '-1003333333333',             // ALBJ French
  ],
  
  // VIP/Holder groups (for exclusive updates)
  VIP_GROUPS: [
    // Add VIP group IDs here
    // Examples:
    // '-1004444444444',             // ALBJ Holders Only
    // '-1005555555555',             // ALBJ NFT Collectors
  ],
  
  // Testing groups (for development)
  TEST_GROUPS: [
    // Add test group IDs here for testing updates
    // Examples:
    // '-1006666666666',             // ALBJ Test Group
    '-4767748512',                   // ALBJ Test Group (Real ID from GetIDsBot)
  ],
  
  // ===================
  // GROUP PERMISSIONS
  // ===================
  
  // Which groups receive which types of updates
  UPDATE_PERMISSIONS: {
    daily: ['MAIN_GROUPS', 'REGIONAL_GROUPS', 'VIP_GROUPS'],
    launch: ['MAIN_GROUPS', 'REGIONAL_GROUPS', 'VIP_GROUPS'],
    price: ['MAIN_GROUPS', 'VIP_GROUPS'],
    nft: ['MAIN_GROUPS', 'VIP_GROUPS'],
    community: ['MAIN_GROUPS', 'REGIONAL_GROUPS'],
    partnerships: ['MAIN_GROUPS', 'VIP_GROUPS'],
    test: ['TEST_GROUPS']
  },
  
  // ===================
  // HELPER FUNCTIONS
  // ===================
  
  // Get all groups for a specific update type
  getGroupsForUpdate(updateType) {
    const allowedGroupTypes = this.UPDATE_PERMISSIONS[updateType] || [];
    let groups = [];
    
    for (const groupType of allowedGroupTypes) {
      if (this[groupType]) {
        groups = groups.concat(this[groupType]);
      }
    }
    
    return groups;
  },
  
  // Get all groups combined
  getAllGroups() {
    return [
      ...this.MAIN_GROUPS,
      ...this.REGIONAL_GROUPS,
      ...this.VIP_GROUPS,
      ...this.TEST_GROUPS
    ];
  },
  
  // Check if a group exists in any category
  isValidGroup(groupId) {
    return this.getAllGroups().includes(groupId);
  },
  
  // ===================
  // SETUP INSTRUCTIONS
  // ===================
  
  SETUP_INSTRUCTIONS: `
📋 **How to Add Groups/Channels:**

1. **Get Group/Channel ID:**
   • For public channels: Use @username (e.g., '@ALBJTokenChannel')
   • For private groups/channels: Get numeric ID
   
2. **Get Numeric ID:**
   • Add @userinfobot to your group
   • Forward a message from the group to @userinfobot
   • Copy the group ID (format: -1001234567890)
   
3. **Add Bot as Admin:**
   • Add @ALBJTokenBot to your group/channel
   • Make it admin with 'Post Messages' permission
   • For channels: Admin with 'Post in Channel' permission
   
4. **Add ID to Config:**
   • Edit this file (groups-config.js)
   • Add the ID to appropriate array:
     - MAIN_GROUPS: Primary communities
     - REGIONAL_GROUPS: Language/region specific
     - VIP_GROUPS: Exclusive holder groups
     - TEST_GROUPS: Development testing
   
5. **Test the Setup:**
   • Run: node daily-updates.js test
   • Run: node daily-updates.js send auto
   
📌 **Important Notes:**
• Bot must be admin in all groups/channels
• Private group IDs start with -100
• Channel IDs start with -100
• Public channels can use @username format
• Test in TEST_GROUPS first before going live
  
🔗 **Useful Bots for Getting IDs:**
• @userinfobot - Get group/channel IDs
• @username_to_id_bot - Convert usernames to IDs
• @getidsbot - Alternative ID lookup bot
  `,
  
  // ===================
  // VALIDATION
  // ===================
  
  validateConfig() {
    const errors = [];
    const warnings = [];
    
    // Check if any groups are configured
    if (this.getAllGroups().length === 0) {
      warnings.push('⚠️ No groups configured yet');
    }
    
    // Check for duplicate IDs
    const allGroups = this.getAllGroups();
    const uniqueGroups = [...new Set(allGroups)];
    if (allGroups.length !== uniqueGroups.length) {
      errors.push('❌ Duplicate group IDs found');
    }
    
    // Check ID formats
    for (const groupId of allGroups) {
      if (typeof groupId === 'string') {
        if (!groupId.startsWith('@') && !groupId.startsWith('-')) {
          errors.push(`❌ Invalid format for group ID: ${groupId}`);
        }
      } else {
        errors.push(`❌ Group ID must be string: ${groupId}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalGroups: allGroups.length,
      groupsByType: {
        main: this.MAIN_GROUPS.length,
        regional: this.REGIONAL_GROUPS.length,
        vip: this.VIP_GROUPS.length,
        test: this.TEST_GROUPS.length
      }
    };
  }
}; 