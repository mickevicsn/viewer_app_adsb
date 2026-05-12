# Reconstruction evaluation: 4BAAD9

ICAO: `4BAAD9`

## Method discovery integrity

The evaluator scores the union of the manifest, `methods/`, and available debug-artifact method references. Without an explicit `--methods` filter, it raises before writing a leaderboard if any discovered non-raw method cannot be loaded and scored.

- Manifest non-raw methods: **27**
- Filesystem non-raw methods: **27**
- Discovered non-raw methods: **27**
- Selected discovered non-raw methods: **27**
- Scored methods: **27**

## Overall ranking

| Rank | Method | Overall score ↓ |
|---:|---|---:|
| 1 | `kalman_rts_balanced` | 0.7169 |
| 2 | `kalman_rts_accurate` | 0.7583 |
| 3 | `kalman_rts_smooth` | 0.834 |
| 4 | `aviation_v_spline_quintic_balanced` | 0.8754 |
| 5 | `aviation_v_spline_quintic_smooth` | 0.8871 |
| 6 | `v_spline_bspline_overlap_smooth` | 0.9001 |
| 7 | `v_spline_bspline_overlap_balanced` | 0.9186 |
| 8 | `v_spline_bspline_join_smooth_balanced` | 0.9257 |
| 9 | `v_spline_bspline_join_smooth_smooth` | 0.929 |
| 10 | `v_spline_bspline_smooth` | 0.9313 |
| 11 | `aviation_v_spline_quintic_accurate` | 0.9369 |
| 12 | `v_spline_bspline_balanced` | 0.9511 |
| 13 | `v_spline_bspline_overlap_accurate` | 0.9882 |
| 14 | `v_spline_bspline_join_smooth_accurate` | 0.9905 |
| 15 | `v_spline_bspline_accurate` | 0.9977 |
| 16 | `aviation_v_spline_bspline_global_accurate` | 1.241 |
| 17 | `aviation_v_spline_bspline_global_smooth` | 1.709 |
| 18 | `aviation_v_spline_bspline_global_balanced` | 2.504 |
| 19 | `v_spline_hermite_stable_smooth` | 7.554e+08 |
| 20 | `v_spline_hermite_stable_balanced` | 7.772e+08 |
| 21 | `v_spline_hermite_stable_accurate` | 8.955e+08 |
| 22 | `v_spline_hermite_smooth` | 9.02e+08 |
| 23 | `v_spline_hermite_balanced` | 1.014e+09 |
| 24 | `v_spline_hermite_accurate` | 1.267e+09 |

## Synthetic deleted-gap holdout ranking

Lower is better. These diagnostic methods are refit after contiguous raw ADS-B windows are deleted, then scored only at the deleted points. They are excluded from the normal overall ranking.

| Rank | Method | Base method | Score ↓ | 3D RMSE m | 3D p95 m | Deleted samples |
|---:|---|---|---:|---:|---:|---:|
| 1 | `kalman_rts_balanced_synthetic_gap` | `kalman_rts_balanced` | 22.63 | 18.16 | 30.2 | 64 |
| 2 | `aviation_v_spline_quintic_balanced_synthetic_gap` | `aviation_v_spline_quintic_balanced` | 24.62 | 19.49 | 29.97 | 64 |
| 3 | `v_spline_bspline_overlap_smooth_synthetic_gap` | `v_spline_bspline_overlap_smooth` | 25.58 | 20.16 | 30.82 | 64 |

## Aviation energy / maneuver detail ranking

Higher is better. This additive ranking focuses on specific-energy tracking, energy-rate detail, climb/descent vertical-rate fidelity, sustained-turn fidelity, and maneuver transition timing.

| Rank | Method | Aviation-detail score ↑ |
|---:|---|---:|
| 1 | `kalman_rts_balanced` | 81.05 |
| 2 | `kalman_rts_accurate` | 78.69 |
| 3 | `kalman_rts_smooth` | 69.52 |
| 4 | `v_spline_bspline_overlap_accurate` | 69.16 |
| 5 | `v_spline_bspline_join_smooth_accurate` | 68.73 |
| 6 | `v_spline_bspline_accurate` | 68.68 |
| 7 | `v_spline_hermite_stable_accurate` | 67.82 |
| 8 | `v_spline_hermite_accurate` | 67.65 |
| 9 | `v_spline_hermite_stable_balanced` | 64.63 |
| 10 | `aviation_v_spline_quintic_balanced` | 64.62 |
| 11 | `aviation_v_spline_quintic_accurate` | 64.29 |
| 12 | `aviation_v_spline_bspline_global_accurate` | 64.18 |
| 13 | `v_spline_hermite_balanced` | 63.88 |
| 14 | `v_spline_hermite_stable_smooth` | 62.82 |
| 15 | `v_spline_bspline_overlap_balanced` | 62.79 |
| 16 | `v_spline_bspline_overlap_smooth` | 62.66 |
| 17 | `aviation_v_spline_quintic_smooth` | 62.46 |
| 18 | `v_spline_hermite_smooth` | 62.4 |
| 19 | `v_spline_bspline_join_smooth_smooth` | 62.31 |
| 20 | `v_spline_bspline_join_smooth_balanced` | 62.15 |
| 21 | `v_spline_bspline_balanced` | 62.08 |
| 22 | `v_spline_bspline_smooth` | 62.06 |
| 23 | `aviation_v_spline_bspline_global_smooth` | 61.71 |
| 24 | `aviation_v_spline_bspline_global_balanced` | 59.2 |

## Reference-free trajectory-model ranking

Higher is better. These scores use raw ADS-B only as noisy evidence, not as truth.

| Rank | Method | Trajectory-model score ↑ |
|---:|---|---:|
| 1 | `kalman_rts_balanced` | 86.32 |
| 2 | `kalman_rts_accurate` | 86.26 |
| 3 | `kalman_rts_smooth` | 86.11 |
| 4 | `aviation_v_spline_bspline_global_accurate` | 84.1 |
| 5 | `v_spline_bspline_overlap_balanced` | 82.37 |
| 6 | `aviation_v_spline_quintic_accurate` | 82.3 |
| 7 | `aviation_v_spline_quintic_smooth` | 82.27 |
| 8 | `v_spline_bspline_overlap_accurate` | 81.9 |
| 9 | `v_spline_bspline_overlap_smooth` | 81.75 |
| 10 | `aviation_v_spline_quintic_balanced` | 81.42 |
| 11 | `aviation_v_spline_bspline_global_smooth` | 80.81 |
| 12 | `v_spline_bspline_join_smooth_accurate` | 80.36 |
| 13 | `v_spline_bspline_accurate` | 80.36 |
| 14 | `v_spline_bspline_balanced` | 79.96 |
| 15 | `v_spline_bspline_join_smooth_balanced` | 79.91 |
| 16 | `v_spline_bspline_join_smooth_smooth` | 79.43 |
| 17 | `v_spline_bspline_smooth` | 79.43 |
| 18 | `aviation_v_spline_bspline_global_balanced` | 74.9 |
| 19 | `v_spline_hermite_stable_smooth` | 70.96 |
| 20 | `v_spline_hermite_stable_balanced` | 70.57 |
| 21 | `v_spline_hermite_smooth` | 70.36 |
| 22 | `v_spline_hermite_balanced` | 69.84 |
| 23 | `v_spline_hermite_stable_accurate` | 68.87 |
| 24 | `v_spline_hermite_accurate` | 68.12 |

## Group scores

Lower is better. Blank means the group had no comparable signal for that method.

| Method | smoothness | aircraft_dynamics | raw_position_fidelity | raw_velocity_fidelity | shape_similarity | endpoint_artifacts | gap_behavior | debug_join_continuity | flight_energy_fidelity | vertical_maneuver_fidelity | turn_maneuver_fidelity | aviation_detail_summary | trajectory_model_reference_free | envelope_violations |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `kalman_rts_balanced` | 0.4733 | 0.9976 | 0.8882 | 0.8277 | 0.9992 | 1.606 |  |  | 0.7016 | 0.4019 | 0.827 | 0.7137 | 0.6966 | 0 |
| `kalman_rts_accurate` | 0.691 | 1.013 | 0.8543 | 0.8818 | 1.001 | 2.076 |  |  | 0.9235 | 0.2646 | 0.8469 | 0.4741 | 0.6996 | 0 |
| `kalman_rts_smooth` | 0.3962 | 0.9632 | 1.282 | 0.7958 | 0.9948 | 0.9327 |  |  | 0.5025 | 1.487 | 0.8931 | 1.261 | 0.707 | 0 |
| `v_spline_bspline_balanced` | 1.1 | 1 | 1.012 | 1.01 | 1 | 0.873 |  | 1.049 | 1.065 | 0.9579 | 1.005 | 0.8754 | 1.021 | 0 |
| `v_spline_bspline_accurate` | 1.299 | 1.006 | 0.921 | 1.122 | 1 | 1.199 |  | 1.032 | 1.346 | 0.7893 | 0.9919 | 0.9514 | 1 | 0 |
| `v_spline_bspline_smooth` | 0.9591 | 0.9893 | 1.183 | 0.9845 | 0.9998 | 0.7317 |  | 0.5612 | 0.8933 | 1.2 | 0.9978 | 0.9146 | 1.047 | 0 |
| `v_spline_hermite_balanced` | 11.81 | 1.104 | 0.9645 | 1.037 | 0.9997 | 1.422 |  | 2.116e+10 | 1.12 | 0.9804 | 1.079 | 0.9153 | 1.535 | 1 |
| `v_spline_hermite_accurate` | 13.8 | 1.103 | 0.8052 | 1.203 | 1 | 2.664 |  | 2.644e+10 | 1.445 | 0.7022 | 1.106 | 0.9621 | 1.623 | 1.667 |
| `v_spline_hermite_smooth` | 11.48 | 1.101 | 1.074 | 0.9915 | 0.9996 | 1.046 |  | 1.883e+10 | 1.004 | 1.074 | 1.086 | 1.089 | 1.509 | 0.6667 |
| `aviation_v_spline_bspline_global_balanced` | 0.3695 | 0.8402 | 11.15 | 2.441 | 1.043 | 0.2108 |  |  | 0.9817 | 2.727 | 1.755 | 1.72 | 1.278 | 0 |
| `aviation_v_spline_bspline_global_accurate` | 0.4403 | 0.9101 | 3.093 | 1.217 | 1.011 | 0.6804 |  |  | 0.6927 | 2.203 | 1.31 | 1.704 | 0.8098 | 0 |
| `aviation_v_spline_bspline_global_smooth` | 0.4 | 0.8725 | 5.965 | 1.731 | 1.023 | 0.3081 |  |  | 0.8217 | 2.529 | 1.504 | 1.771 | 0.9771 | 0 |
| `v_spline_bspline_overlap_balanced` | 1.036 | 1 | 0.9852 | 0.9904 | 1 | 0.8772 |  | 1.306 | 1.016 | 0.9624 | 0.9528 | 0.7118 | 0.8975 | 0 |
| `v_spline_bspline_overlap_accurate` | 1.259 | 1.004 | 0.8773 | 1.087 | 0.9996 | 1.458 |  | 1.833 | 1.277 | 0.7239 | 0.9625 | 0.6183 | 0.9216 | 0 |
| `v_spline_bspline_overlap_smooth` | 0.7919 | 0.9873 | 1.162 | 0.9712 | 0.9998 | 0.7817 |  | 0.8091 | 0.8754 | 1.075 | 0.9556 | 1.033 | 0.9293 | 0 |
| `v_spline_bspline_join_smooth_balanced` | 1.074 | 1 | 0.9988 | 0.9961 | 1 | 0.8797 |  | 0.8855 | 1.04 | 0.9539 | 1 | 0.7196 | 1.023 | 0 |
| `v_spline_bspline_join_smooth_accurate` | 1.281 | 1.008 | 0.9102 | 1.105 | 1 | 1.211 |  | 1.028 | 1.316 | 0.7782 | 1.006 | 0.9508 | 0.9998 | 0 |
| `v_spline_bspline_join_smooth_smooth` | 0.9573 | 0.9894 | 1.179 | 0.9741 | 0.9999 | 0.7305 |  | 0.5516 | 0.8797 | 1.192 | 0.9945 | 0.9473 | 1.047 | 0 |
| `v_spline_hermite_stable_balanced` | 11.77 | 1.105 | 0.9561 | 1.012 | 0.9997 | 1.429 |  | 1.622e+10 | 1.082 | 0.9822 | 1.072 | 0.9944 | 1.498 | 1 |
| `v_spline_hermite_stable_accurate` | 13.82 | 1.106 | 0.7969 | 1.177 | 1 | 2.701 |  | 1.869e+10 | 1.426 | 0.6938 | 1.088 | 0.9274 | 1.585 | 1.333 |
| `v_spline_hermite_stable_smooth` | 11.43 | 1.102 | 1.065 | 0.9684 | 0.9996 | 1.05 |  | 1.577e+10 | 0.9692 | 1.076 | 1.085 | 1.159 | 1.479 | 0.6667 |
| `aviation_v_spline_quintic_balanced` | 0.6842 | 0.9784 | 1.181 | 0.9549 | 1 | 1.207 |  | 0.4663 | 0.8258 | 1.126 | 0.9458 | 0.8839 | 0.9461 | 0 |
| `aviation_v_spline_quintic_accurate` | 0.8429 | 1.001 | 0.9466 | 1.054 | 0.9998 | 2.682 |  | 0.5179 | 1.154 | 0.782 | 0.9757 | 1.089 | 0.9011 | 0 |
| `aviation_v_spline_quintic_smooth` | 0.7112 | 0.9845 | 1.204 | 0.9735 | 1 | 0.9133 |  | 0.4659 | 0.8777 | 1.153 | 0.9613 | 1.051 | 0.9025 | 0 |

## Metric winners

| Metric | Group | Winner | Best value |
|---|---|---|---:|
| `bank_angle_airborne_p95_deg` | aircraft_dynamics | `aviation_v_spline_bspline_global_balanced` | 18.85 |
| `curvature_airborne_p95` | aircraft_dynamics | `aviation_v_spline_bspline_global_balanced` | 0.0002777 |
| `curvature_airborne_rms` | aircraft_dynamics | `aviation_v_spline_bspline_global_smooth` | 0.0001338 |
| `turn_rate_airborne_p95_deg_s` | aircraft_dynamics | `aviation_v_spline_bspline_global_balanced` | 1.741 |
| `aviation_detail_score_loss_lower_is_better` | aviation_detail_summary | `kalman_rts_balanced` | 18.95 |
| `energy_rate_detail_log_ratio_abs` | aviation_detail_summary | `v_spline_bspline_accurate` | 0.139 |
| `specific_energy_detail_log_ratio_abs` | aviation_detail_summary | `v_spline_bspline_overlap_balanced` | 0.004017 |
| `debug_join_acceleration_jump_p95_mps2` | debug_join_continuity | `v_spline_hermite_stable_balanced` | 0.001602 |
| `debug_join_continuity_failure_count` | debug_join_continuity | `v_spline_bspline_balanced` | 0 |
| `debug_join_jerk_jump_p95_mps3` | debug_join_continuity | `aviation_v_spline_quintic_balanced` | 0.3876 |
| `debug_join_velocity_jump_p95_mps` | debug_join_continuity | `v_spline_bspline_join_smooth_smooth` | 8.841e-11 |
| `endpoint_accel_rms_ratio` | endpoint_artifacts | `aviation_v_spline_bspline_global_balanced` | 0.03964 |
| `endpoint_jerk_rms_ratio` | endpoint_artifacts | `aviation_v_spline_bspline_global_balanced` | 0.1222 |
| `envelope_violation_jerk_count` | envelope_violations | `kalman_rts_balanced` | 0 |
| `raw_energy_rate_correlation_loss` | flight_energy_fidelity | `kalman_rts_smooth` | 0.132 |
| `raw_energy_rate_error_mps_p95_abs` | flight_energy_fidelity | `kalman_rts_smooth` | 5.27 |
| `raw_energy_rate_error_mps_rmse` | flight_energy_fidelity | `kalman_rts_smooth` | 2.929 |
| `raw_energy_rate_sign_mismatch_fraction` | flight_energy_fidelity | `kalman_rts_smooth` | 0.1007 |
| `raw_maneuver_energy_rate_error_mps_rmse` | flight_energy_fidelity | `kalman_rts_smooth` | 3.241 |
| `raw_specific_energy_error_m_p95_abs` | flight_energy_fidelity | `kalman_rts_smooth` | 34.48 |
| `raw_specific_energy_error_m_rmse` | flight_energy_fidelity | `kalman_rts_smooth` | 38.97 |
| `specific_energy_total_change_error_m_abs` | flight_energy_fidelity | `kalman_rts_balanced` | 107.2 |
| `raw_along_track_error_m_rmse` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 16.16 |
| `raw_cross_track_error_m_rmse` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 1.686 |
| `raw_horizontal_position_error_m_p95_abs` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 33.4 |
| `raw_horizontal_position_error_m_rmse` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 16.76 |
| `raw_position_3d_error_m_p95_abs` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 33.42 |
| `raw_position_3d_error_m_rmse` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 16.84 |
| `raw_vertical_position_error_m_p95_abs` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 3.301 |
| `raw_vertical_position_error_m_rmse` | raw_position_fidelity | `v_spline_hermite_stable_accurate` | 1.623 |
| `raw_groundspeed_error_mps_rmse` | raw_velocity_fidelity | `kalman_rts_smooth` | 1.058 |
| `raw_horizontal_velocity_error_mps_rmse` | raw_velocity_fidelity | `kalman_rts_balanced` | 3.197 |
| `raw_track_angle_error_deg_rmse` | raw_velocity_fidelity | `kalman_rts_accurate` | 1.41 |
| `discrete_frechet_distance_m` | shape_similarity | `kalman_rts_smooth` | 1039 |
| `dtw_mean_step_distance_m` | shape_similarity | `kalman_rts_smooth` | 101.7 |
| `raw_to_reconstruction_hausdorff_distance_m` | shape_similarity | `v_spline_hermite_smooth` | 785.6 |
| `symmetric_hausdorff_distance_m` | shape_similarity | `v_spline_hermite_smooth` | 785.6 |
| `accel_max_mps2` | smoothness | `kalman_rts_smooth` | 5.178 |
| `accel_p95_mps2` | smoothness | `aviation_v_spline_bspline_global_balanced` | 3.417 |
| `accel_rms_mps2` | smoothness | `aviation_v_spline_bspline_global_balanced` | 1.523 |
| `hf_accel_energy_ratio` | smoothness | `kalman_rts_smooth` | 7.238e-06 |
| `hf_jerk_energy_ratio` | smoothness | `kalman_rts_smooth` | 4.915e-06 |
| `jerk_max_mps3` | smoothness | `kalman_rts_smooth` | 0.322 |
| `jerk_p95_mps3` | smoothness | `aviation_v_spline_bspline_global_balanced` | 0.2258 |
| `jerk_rms_mps3` | smoothness | `aviation_v_spline_bspline_global_balanced` | 0.09652 |
| `trajectory_model_score_loss_lower_is_better` | trajectory_model_reference_free | `kalman_rts_balanced` | 13.68 |
| `raw_heading_error_deg_rmse` | turn_maneuver_fidelity | `kalman_rts_accurate` | 1.393 |
| `raw_lateral_accel_error_mps2_rmse` | turn_maneuver_fidelity | `kalman_rts_balanced` | 0.2625 |
| `raw_sustained_turn_rate_error_deg_s_rmse` | turn_maneuver_fidelity | `kalman_rts_balanced` | 0.2321 |
| `raw_turn_rate_error_deg_s_rmse` | turn_maneuver_fidelity | `kalman_rts_balanced` | 0.1432 |
| `turn_event_heading_change_error_deg_rmse` | turn_maneuver_fidelity | `kalman_rts_accurate` | 1.538 |
| `turn_state_sign_mismatch_fraction` | turn_maneuver_fidelity | `kalman_rts_smooth` | 0.01469 |
| `turn_transition_nearest_time_error_s_p95` | turn_maneuver_fidelity | `aviation_v_spline_bspline_global_balanced` | 413.9 |
| `raw_climb_descent_vertical_rate_error_mps_rmse` | vertical_maneuver_fidelity | `kalman_rts_accurate` | 0.196 |
| `raw_climb_vertical_rate_error_mps_rmse` | vertical_maneuver_fidelity | `kalman_rts_accurate` | 0.304 |
| `raw_descent_vertical_rate_error_mps_rmse` | vertical_maneuver_fidelity | `kalman_rts_accurate` | 0.1567 |
| `raw_level_vertical_rate_error_mps_rmse` | vertical_maneuver_fidelity | `kalman_rts_accurate` | 0.1778 |
| `vertical_state_sign_mismatch_fraction` | vertical_maneuver_fidelity | `kalman_rts_accurate` | 0.01238 |
| `vertical_transition_nearest_time_error_s_p95` | vertical_maneuver_fidelity | `kalman_rts_accurate` | 4.025 |

Generated files:

- `evaluation_summary.json`
- `evaluation_metrics.csv`
- `evaluation_group_scores.csv`
- `aviation_detail_metrics.csv`
- `trajectory_model_metrics.csv`
- `synthetic_gap_holdout_metrics.csv`
- `evaluation_method_discovery.csv`
