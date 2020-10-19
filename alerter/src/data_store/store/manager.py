import logging
from time import sleep
from multiprocessing import Process
from alerter.src.data_store.store.alert import AlertStore
from alerter.src.data_store.store.github import GithubStore
from alerter.src.data_store.store.system import SystemStore

class StoreManager:
    def __init__(self, logger: logging.Logger):
        self._logger = logger
        self._system_store = SystemStore(self.logger)
        self._github_store = GithubStore(self.logger)
        self._alert_store = AlertStore(self.logger)

    @property
    def logger(self) -> logging.Logger:
        return self._logger

    @property
    def system_store(self) -> SystemStore:
        return self._system_store

    @property
    def github_store(self) -> GithubStore:
        return self._github_store

    @property
    def alert_store(self) -> AlertStore:
        return self._alert_store

    """
        Starts all the store processes, these will initialize all the rabbitmq
        interfaces together with mongo client connections. All rabbit instances
        will then begin listening for incoming messages.
    """
    def start_store_manager(self) -> None:
        processes = []
        stores = [self.system_store, self.github_store, self.alert_store]
        for instance in stores:
            instance._initialize_store()
            process = Process(target=instance._start_listening, args=())
            process.daemon = True
            process.start()
            processes.append(process)

        for process in processes:
            process.join()