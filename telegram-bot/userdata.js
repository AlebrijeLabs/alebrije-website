const fs = require('fs');
const path = require('path');

// File to store user data
const DATA_FILE = path.join(__dirname, 'users.json');

// Initialize data structure
let userData = {};

// Load existing data on startup
function loadUserData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      userData = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    userData = {};
  }
}

// Save data to file
function saveUserData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(userData, null, 2));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
}

// Get user data or create new user
function getUser(userId) {
  if (!userData[userId]) {
    userData[userId] = {
      userId: userId,
      username: '',
      firstName: '',
      checkIn: {
        lastCheckIn: null,
        streak: 0,
        totalCheckins: 0,
        spiritPoints: 0,
        badges: [],
        streakRecord: 0
      },
      notifications: {
        launch: true,
        community: true,
        partnerships: true,
        spirits: true,
        events: true,
        price: false
      },
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    saveUserData();
  }
  return userData[userId];
}

// Update user activity
function updateUserActivity(userId, username = '', firstName = '') {
  const user = getUser(userId);
  user.lastActive = new Date().toISOString();
  if (username) user.username = username;
  if (firstName) user.firstName = firstName;
  saveUserData();
  return user;
}

// Check-in functions
function canCheckIn(userId) {
  const user = getUser(userId);
  if (!user.checkIn.lastCheckIn) return true;
  
  const lastCheckIn = new Date(user.checkIn.lastCheckIn);
  const now = new Date();
  const timeDiff = now.getTime() - lastCheckIn.getTime();
  const hoursDiff = timeDiff / (1000 * 3600);
  
  return hoursDiff >= 24;
}

function performCheckIn(userId) {
  const user = getUser(userId);
  const now = new Date();
  
  // Check if can check in
  if (!canCheckIn(userId)) {
    return {
      success: false,
      alreadyChecked: true,
      streak: user.checkIn.streak,
      nextCheckIn: getNextCheckInTime(userId)
    };
  }
  
  // Check if streak continues or breaks
  let streakContinues = false;
  if (user.checkIn.lastCheckIn) {
    const lastCheckIn = new Date(user.checkIn.lastCheckIn);
    const timeDiff = now.getTime() - lastCheckIn.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    // Streak continues if within 48 hours
    streakContinues = hoursDiff <= 48;
  }
  
  // Update streak
  if (streakContinues || !user.checkIn.lastCheckIn) {
    user.checkIn.streak += 1;
  } else {
    user.checkIn.streak = 1; // Reset streak
  }
  
  // Update record if needed
  if (user.checkIn.streak > user.checkIn.streakRecord) {
    user.checkIn.streakRecord = user.checkIn.streak;
  }
  
  // Calculate reward
  const reward = calculateReward(user.checkIn.streak);
  user.checkIn.spiritPoints += reward.points;
  
  // Add badges if earned
  if (reward.badge) {
    user.checkIn.badges.push({
      name: reward.badge,
      earnedDate: now.toISOString(),
      streak: user.checkIn.streak
    });
  }
  
  // Update check-in data
  user.checkIn.lastCheckIn = now.toISOString();
  user.checkIn.totalCheckins += 1;
  
  saveUserData();
  
  return {
    success: true,
    streak: user.checkIn.streak,
    reward: reward,
    spiritPoints: user.checkIn.spiritPoints,
    isStreakBroken: !streakContinues && user.checkIn.totalCheckins > 1
  };
}

function calculateReward(streak) {
  const basePoints = 10;
  let points = basePoints + (streak * 5);
  let badge = null;
  let specialMessage = '';
  
  // Special rewards for milestones
  if (streak === 7) {
    points += 25; // Bonus for weekly
    badge = 'Weekly Warrior';
    specialMessage = 'Weekly bonus unlocked!';
  } else if (streak === 14) {
    points += 50;
    badge = 'Spirit Master';
    specialMessage = 'Two weeks of dedication!';
  } else if (streak === 30) {
    points += 150;
    badge = 'Alebrije Legend';
    specialMessage = 'Monthly legend status achieved!';
  } else if (streak === 100) {
    points += 500;
    badge = 'Eternal Spirit';
    specialMessage = 'You are one with the Alebrijes!';
  }
  
  return {
    points,
    badge,
    specialMessage,
    description: `${points} Spirit Points${badge ? ` + ${badge} Badge` : ''}${specialMessage ? ` - ${specialMessage}` : ''}`
  };
}

function getNextCheckInTime(userId) {
  const user = getUser(userId);
  if (!user.checkIn.lastCheckIn) return 'Available now!';
  
  const lastCheckIn = new Date(user.checkIn.lastCheckIn);
  const nextCheckIn = new Date(lastCheckIn.getTime() + (24 * 60 * 60 * 1000));
  
  return nextCheckIn.toLocaleString();
}

// Notification functions
function updateNotificationPreference(userId, notificationType, enabled) {
  const user = getUser(userId);
  if (user.notifications.hasOwnProperty(notificationType)) {
    user.notifications[notificationType] = enabled;
    saveUserData();
    return true;
  }
  return false;
}

function getNotificationPreferences(userId) {
  const user = getUser(userId);
  return user.notifications;
}

function getUsersForNotification(notificationType) {
  return Object.values(userData)
    .filter(user => user.notifications[notificationType])
    .map(user => user.userId);
}

// Stats functions
function getUserStats(userId) {
  const user = getUser(userId);
  const daysSinceJoin = Math.floor((new Date() - new Date(user.joinDate)) / (1000 * 60 * 60 * 24));
  
  return {
    ...user,
    stats: {
      daysSinceJoin,
      checkInRate: daysSinceJoin > 0 ? Math.round((user.checkIn.totalCheckins / daysSinceJoin) * 100) : 0,
      badgeCount: user.checkIn.badges.length,
      nextMilestone: getNextMilestone(user.checkIn.streak)
    }
  };
}

function getNextMilestone(currentStreak) {
  const milestones = [7, 14, 30, 50, 100];
  return milestones.find(milestone => milestone > currentStreak) || 365;
}

// Initialize on module load
loadUserData();

module.exports = {
  getUser,
  updateUserActivity,
  canCheckIn,
  performCheckIn,
  getNextCheckInTime,
  updateNotificationPreference,
  getNotificationPreferences,
  getUsersForNotification,
  getUserStats,
  loadUserData,
  saveUserData
}; 