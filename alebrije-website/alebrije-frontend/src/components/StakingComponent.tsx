import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';
import { getStakingInfo, getStakingPool, stakeTokens, unstakeTokens, claimRewards, StakingInfo, StakingPool } from '../services/staking-service';
import { STAKING_CONFIG } from '../constants';

const StakingComponent = () => {
  const { publicKey } = useWallet();
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [stakingPool, setStakingPool] = useState<StakingPool | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [unstakeAmount, setUnstakeAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  useEffect(() => {
    if (publicKey) {
      fetchStakingInfo();
      fetchStakingPool();
    }
  }, [publicKey]);

  const fetchStakingInfo = async () => {
    if (!publicKey) return;
    try {
      const info = await getStakingInfo(publicKey);
      setStakingInfo(info);
    } catch (error) {
      toast.error('Failed to fetch staking info');
    }
  };

  const fetchStakingPool = async () => {
    try {
      const pool = await getStakingPool();
      setStakingPool(pool);
    } catch (error) {
      toast.error('Failed to fetch staking pool info');
    }
  };

  const handleStake = async () => {
    if (!publicKey || !stakeAmount) return;
    try {
      setLoading(true);
      const amount = parseFloat(stakeAmount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }
      await stakeTokens(publicKey, amount);
      toast.success('Successfully staked tokens');
      setStakeAmount('');
      await fetchStakingInfo();
      await fetchStakingPool();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!publicKey || !unstakeAmount) return;
    try {
      setLoading(true);
      const amount = parseFloat(unstakeAmount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }
      await unstakeTokens(publicKey, amount);
      toast.success('Successfully unstaked tokens');
      setUnstakeAmount('');
      await fetchStakingInfo();
      await fetchStakingPool();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unstake tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!publicKey) return;
    try {
      setIsClaiming(true);
      await claimRewards(publicKey);
      toast.success('Successfully claimed rewards');
      await fetchStakingInfo();
    } catch (error) {
      toast.error('Failed to claim rewards');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="staking-container">
        <h2>Staking</h2>
        <p>Please connect your wallet to start staking ALBJ tokens.</p>
      </div>
    );
  }

  return (
    <div className="staking-container">
      <h2>Stake ALBJ Tokens</h2>
      
      {/* Staking Pool Info */}
      {stakingPool && (
        <div className="staking-info">
          <h3>Staking Pool</h3>
          <p>Total Staked: {stakingPool.totalStaked.toLocaleString()} ALBJ</p>
          <p>Number of Stakers: {stakingPool.numberOfStakers}</p>
          <p>Average Stake: {stakingPool.averageStakeAmount.toLocaleString()} ALBJ</p>
        </div>
      )}

      {/* User's Staking Info */}
      {stakingInfo && (
        <div className="staking-info">
          <h3>Your Staking Info</h3>
          <p>Staked Amount: {stakingInfo.stakedAmount.toLocaleString()} ALBJ</p>
          <p>Available Rewards: {stakingInfo.availableRewards.toLocaleString()} ALBJ</p>
          <p>APY: {stakingInfo.apy}%</p>
          {stakingInfo.lockPeriodEnd && (
            <p>Lock Period Ends: {stakingInfo.lockPeriodEnd.toLocaleDateString()}</p>
          )}
        </div>
      )}

      {/* Staking Form */}
      <div className="staking-form">
        <h3>Stake Tokens</h3>
        <div className="form-group">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Amount to stake"
          />
          <button
            onClick={handleStake}
            disabled={loading || !stakeAmount}
          >
            {loading ? 'Staking...' : 'Stake'}
          </button>
        </div>
        <p className="form-hint">
          Min: {STAKING_CONFIG.MIN_STAKE_AMOUNT.toLocaleString()} ALBJ | 
          Max: {STAKING_CONFIG.MAX_STAKE_AMOUNT.toLocaleString()} ALBJ
        </p>
      </div>

      {/* Unstaking Form */}
      <div className="staking-form">
        <h3>Unstake Tokens</h3>
        <div className="form-group">
          <input
            type="number"
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
            placeholder="Amount to unstake"
          />
          <button
            onClick={handleUnstake}
            disabled={loading || !unstakeAmount}
          >
            {loading ? 'Unstaking...' : 'Unstake'}
          </button>
        </div>
      </div>

      {/* Claim Rewards Button */}
      {stakingInfo && stakingInfo.availableRewards > 0 && (
        <div className="claim-rewards">
          <button
            onClick={handleClaimRewards}
            disabled={isClaiming}
          >
            {isClaiming ? 'Claiming...' : 'Claim Rewards'}
          </button>
        </div>
      )}

      {/* Reward Distribution Info */}
      <div className="staking-reward-distribution">
        <h3>Reward Distribution</h3>
        <div className="distribution-diagram">
          <div className="diagram-container">
            <div className="diagram-title">Staking Reward Flow</div>
            <div className="diagram-flow">
              <div className="flow-step">
                <div className="step-title">User Stakes ALBJ</div>
                <div className="step-arrow">↓</div>
              </div>
              <div className="flow-step">
                <div className="step-title">Rewards Generated (15% APY)</div>
                <div className="step-arrow">↓</div>
              </div>
              <div className="flow-step">
                <div className="step-title">Reward Distribution</div>
                <div className="distribution-split">
                  <div className="split-item">
                    <div className="split-percentage">98%</div>
                    <div className="split-label">User Rewards</div>
                  </div>
                  <div className="split-item">
                    <div className="split-percentage">2%</div>
                    <div className="split-label">Development Fund</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingComponent; 