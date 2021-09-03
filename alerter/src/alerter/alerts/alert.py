from typing import Dict, Optional

from src.alerter.alert_code import AlertCode
from src.alerter.alert_data import AlertData
from src.alerter.grouped_alerts_metric_code import GroupedAlertsMetricCode


class Alert:

    def __init__(
            self, alert_code: AlertCode, message: str, severity: str,
            timestamp: float, parent_id: str, origin_id: str,
            alert_group_metric_code: GroupedAlertsMetricCode,
            alert_data: Optional[AlertData] = None) -> None:
        self._alert_code = alert_code
        self._message = message
        self._severity = severity
        self._parent_id = parent_id
        self._origin_id = origin_id
        self._timestamp = timestamp
        self._alert_group_metric_code = alert_group_metric_code
        self._alert_data = alert_data

    def __str__(self) -> str:
        return self.message

    @property
    def alert_code(self) -> AlertCode:
        return self._alert_code

    @property
    def message(self) -> str:
        return self._message

    @property
    def severity(self) -> str:
        return self._severity

    @property
    def parent_id(self) -> str:
        return self._parent_id

    @property
    def origin_id(self) -> str:
        return self._origin_id

    @property
    def timestamp(self) -> float:
        return self._timestamp

    @property
    def alert_group_metric_code(self) -> GroupedAlertsMetricCode:
        return self._alert_group_metric_code

    @property
    def alert_data(self) -> Dict:
        return {
            'alert_code': {
                'name': self._alert_code.name,
                'code': self._alert_code.value
            },
            'metric': self._alert_group_metric_code.value,
            'message': self._message,
            'severity': self._severity,
            'parent_id': self._parent_id,
            'origin_id': self._origin_id,
            'timestamp': self._timestamp,
            'alert_data': self._alert_data
        }
