# CI/CD and Kubernetes lab

This directory contains a small dependency-free Node.js API, unit/integration tests,
Docker files, a GitHub Actions CI workflow, and manifests for a local `kind` cluster.

## Run tests

```bash
cd _resource/docker-advanced/08-cicd-and-kubernetes
npm ci
npm test
```

## Run locally

```bash
npm start
curl http://localhost:3000/healthz
```

## Deploy to kind

No public IP is required. Create the cluster, load an image, and deploy it:

```bash
kind create cluster --name lab --config kind-config.yaml
docker build -t task-api:lab .
kind load docker-image task-api:lab --name lab
sed 's#ghcr.io/acme/task-api@sha256:replace-with-release-digest#task-api:lab#' \
  deployment.yaml | kubectl apply -f -
kubectl apply -f service.yaml
kubectl rollout status deployment/task-api --timeout=5m
curl http://localhost:30080/healthz
```

The kind host's kubeconfig is enough. `kubectl port-forward` is also an option:

```bash
kubectl port-forward service/task-api 3000:3000
curl http://localhost:3000/healthz
```

For deployment with the exact GHCR digest:

```bash
sh deploy-kind.sh lab ghcr.io/acme/task-api@sha256:REPLACE_WITH_DIGEST
```

## How CI/CD reaches kind

The hosted GitHub Actions runner cannot directly access a kind cluster on your laptop.
For lab CD, run a GitHub Actions self-hosted runner on the machine that owns kind,
label it `kind`, and run `deploy-kind.yaml` through **Actions > Deploy tested digest
to kind > Run workflow**. The runner needs Docker, kind, kubectl, and GHCR access.

A public IP is required only for an externally reachable Kubernetes control plane or
public Service endpoint. It is not required for local kind access. Alternatively,
use a private VPN/Tailscale network or an SSH tunnel for a remote machine.
