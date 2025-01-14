# Distributed LLM Cluster Manager

A practical solution for running and managing multiple LMStudio instances across your network, providing automatic load balancing and failover capabilities.

## The Problem

Running local LLMs is great for privacy and control, but it comes with challenges:
- Single machine bottlenecks
- Resource underutilization
- Lack of redundancy
- Manual load balancing

## The Solution

I've created a distributed LLM cluster manager that turns your network of computers into a scalable inference cluster. Think of it as a "bot network" but for good - it automatically discovers, manages, and load balances LLM instances across your network.

### Key Features

 **Auto-Discovery**
- Automatically finds LMStudio instances on your network
- No manual configuration needed
- Dynamically adapts as instances come and go

 **Smart Load Balancing**
- Routes requests to least loaded instances
- Considers CPU usage, queue length, and response times
- Automatically handles failover

 **Real-time Monitoring**
- Track instance health and performance
- Monitor request patterns
- Identify bottlenecks and issues

 **OpenAI-Compatible API**
- Drop-in replacement for OpenAI endpoints
- Works with existing tools and libraries
- Minimal code changes required

## Getting Started

1. Install LMStudio on your machines
2. Enable network access in LMStudio settings
3. Install dependencies:
```bash
pip install -r requirements.txt
```
4. Run the cluster manager:
```bash
python -m uvicorn utils.cluster_api:app --host 0.0.0.0 --port 8000
```

## How It Works

The system consists of two main components:

1. **Cluster Manager** (`llm_cluster.py`)
   - Handles instance discovery and health monitoring
   - Implements load balancing logic
   - Tracks performance metrics

2. **API Layer** (`cluster_api.py`)
   - Provides OpenAI-compatible endpoints
   - Routes requests to appropriate instances
   - Exposes monitoring endpoints

## API Endpoints

- `/v1/chat/completions` - Standard chat completion endpoint
- `/cluster/status` - Get cluster health and metrics
- `/cluster/best_instance` - Information about optimal instance

## Future Enhancements

I'm actively working on adding:
- Geographic routing for multi-location setups
- Priority weighting for heterogeneous hardware
- Advanced queueing mechanisms
- Custom model routing

## Why This Matters

In my experience building AI systems at scale, I've found that the ability to efficiently utilize available resources is crucial. This project brings enterprise-level load balancing to local LLM deployments, making it easier to scale your AI infrastructure without the cloud costs.

## Get Involved

Feel free to reach out on [LinkedIn](https://www.linkedin.com/in/paulrwade/) or check out my other projects on [GitHub](https://github.com/paul-wade). I'm always interested in collaborating on innovative AI infrastructure projects!

## License

MIT License - Feel free to use, modify, and share!
