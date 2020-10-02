pkill -f tmux
tmux new-session -d -s "Servidor" 'git pull && npm install && npm run dev'
