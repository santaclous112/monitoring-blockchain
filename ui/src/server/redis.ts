import redis, {RetryStrategyOptions} from "redis"
import {MaxRetryAttemptsExceeded, MaxRetryTimeExceeded,} from "./errors"
import {MSG_REDIS_CONNECTED, MSG_REDIS_RECONNECTING} from "./msgs";

export const getRedisHashes = () => ({
    parent: 'hash_p1'
});

export const getAlerterKeys = () => ({
    mute: 'a1',
});

export const getSystemKeys = () => ({
    process_cpu_seconds_total: 's1',
    process_memory_usage: 's2',
    virtual_memory_usage: 's3',
    open_file_descriptors: 's4',
    system_cpu_usage: 's5',
    system_ram_usage: 's6',
    system_storage_usage: 's7',
    network_transmit_bytes_per_second: 's8',
    network_receive_bytes_per_second: 's9',
    network_receive_bytes_total: 's10',
    network_transmit_bytes_total: 's11',
    disk_io_time_seconds_total: 's12',
    disk_io_time_seconds_in_interval: 's13',
    last_monitored: 's14',
    system_went_down_at: 's15',
});

export const getGitHubKeys = () => ({
    no_of_releases: 'gh1',
    last_monitored: 'gh2',
});

export const getComponentKeys = () => ({
    heartbeat: 'c1'
});

export const getChainKeys = () => ({
    mute_alerts: 'ch1'
});

export const getConfigKeys = () => ({
    config: 'conf1'
});

export const getAlertKeys = () => ({
    open_file_descriptors: 'alert1',
    system_cpu_usage: 'alert2',
    system_storage_usage: 'alert3',
    system_ram_usage: 'alert4',
    system_is_down: 'alert5',
    metric_not_found: 'alert6',
    invalid_url: 'alert7',
    github_release: 'alert8',
    cannot_access_github: 'alert9',
});

export class RedisAPI {
    host: string;
    port: number;
    password?: string;
    client?: redis.RedisClient;

    constructor(host = "localhost", port = 6379, password?: string) {
        this.host = host;
        this.port = port;
        this.password = password;
        this.client = undefined;
    }

    connect() {
        if (this.client && this.client.connected) {
            return;
        }
        this.client = redis.createClient({
            host: this.host,
            port: this.port,
            password: this.password,
            no_ready_check: true,
            retry_strategy: (options: RetryStrategyOptions) => {
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all
                    // commands with an individual error
                    return new MaxRetryTimeExceeded();
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return new MaxRetryAttemptsExceeded();
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            },
            connect_timeout: 10000, // 10 * 1000 ms
        });
        this.client.on('error', (error) => {
            console.error(error);
        });
        this.client.on('reconnecting', () => {
            console.log(MSG_REDIS_RECONNECTING);
        });
        this.client.on('ready', () => {
            console.debug(MSG_REDIS_CONNECTED);
        });
        return;
    }

    disconnect() {
        if (this.client) {
            this.client.quit()
        }
    }

}

// TODO: Disconnect, hset, set, get, hget, multiple gets and sets for both h and
//     : with no h.
