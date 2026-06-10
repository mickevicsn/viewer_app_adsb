# Fair reconstruction evaluation: 4BAAD9

ICAO: `4BAAD9`

Metric family: `fair_kalman_rts_vs_bea_v_spline_reduced_v2`

Raw ADS-B is treated as noisy evidence, not truth.

## Overall ranking

| Rank | Method | Family | Preset | Overall ↓ | Evidence ↓ | Kinematic ↓ | Continuity ↓ | Motion ↓ | Gap ↓ |
|---:|---|---|---|---:|---:|---:|---:|---:|---:|
| 1 | `kalman_rts_balanced` | `kalman_rts` | `balanced` | 0.1256 | 0.1485 | 0.0004644 | 0 | 0.3191 | 0 |
| 2 | `kalman_rts_smooth` | `kalman_rts` | `smooth` | 0.127 | 0.184 | 0.0002749 | 0 | 0.3004 | 0 |
| 3 | `kalman_rts_accurate` | `kalman_rts` | `accurate` | 0.1344 | 0.1406 | 0.0009557 | 0 | 0.3532 | 0 |
| 4 | `bea_v_spline_accurate` | `bea_v_spline` | `accurate` | 0.1424 | 0.2412 | 0.0003685 | 0.02209 | 0.306 | 0 |
| 5 | `bea_v_spline_balanced` | `bea_v_spline` | `balanced` | 0.1557 | 0.3193 | 0.0002808 | 0.02444 | 0.2978 | 0 |
| 6 | `bea_v_spline_smooth` | `bea_v_spline` | `smooth` | 0.2147 | 0.6255 | 0.0002525 | 0.0273 | 0.2894 | 0 |

## Core metrics

| Method | Pos p95 m | Vel p95 m/s | Vel-deriv closure p95 m/s | Step closure p95 m | Join pos closure p95 m | Same-time pos jump max m | Accel p95 m/s² | Jerk p95 m/s³ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| `kalman_rts_balanced` | 35.13 | 7.507 | 0.004137 | 0.0005169 | 0 | 0 | 4.317 | 0.3967 |
| `kalman_rts_smooth` | 40.16 | 7.722 | 0.002449 | 0.0003063 | 0 | 0 | 4.177 | 0.235 |
| `kalman_rts_accurate` | 33.63 | 7.554 | 0.008514 | 0.001066 | 0 | 0 | 4.472 | 0.8123 |
| `bea_v_spline_accurate` | 47.2 | 8.321 | 0.003284 | 0.0004041 | 0.0004869 | 0 | 4.19 | 0.3185 |
| `bea_v_spline_balanced` | 58.55 | 8.718 | 0.002502 | 0.0003079 | 0.0002938 | 0 | 4.132 | 0.244 |
| `bea_v_spline_smooth` | 102.8 | 10.34 | 0.00225 | 0.0002773 | 0.0003916 | 0 | 4.031 | 0.2185 |

## Scoring configuration

- Evidence mode: `paired`
- Position noise floor: `25 m`
- Velocity noise floor: `4 m/s`
- Long-gap threshold: `10 s`
- Join-time tolerance: `2 s`
- Group weights: `{'evidence_fit': 0.2, 'kinematic_consistency': 0.3, 'continuity': 0.1, 'motion_smoothness': 0.3, 'gap_behavior': 0.1}`

Generated files: `evaluation_summary.json`, `evaluation_metrics.csv`, `evaluation_core_metrics.csv`, `evaluation_group_scores.csv`, and `evaluation_report.md`.
