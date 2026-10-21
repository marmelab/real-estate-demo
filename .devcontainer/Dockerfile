FROM node:26-trixie

RUN apt update && apt install -y sudo build-essential

ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER node

# Pre-created so the ~/.supabase volume (CLI login token) is owned by node, not root.
RUN mkdir -p /home/node/.supabase

ENV DEVCONTAINER=true
